import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const range = searchParams.get("range") || "7d";

  const now = new Date();
  let startDate = new Date();
  let prevStartDate = new Date();

  if (range === "24h") {
    startDate.setHours(now.getHours() - 24);
    prevStartDate.setHours(now.getHours() - 48);
  } else if (range === "30d") {
    startDate.setDate(now.getDate() - 30);
    prevStartDate.setDate(now.getDate() - 60);
  } else if (range === "all") {
    startDate = new Date(2025, 0, 1);
    prevStartDate = new Date(2024, 0, 1);
  } else {
    // Default: 7d
    startDate.setDate(now.getDate() - 7);
    prevStartDate.setDate(now.getDate() - 14);
  }

  try {
    const [
      currentEvents,
      previousPageviewsCount,
      previousVisitorsRaw,
      recentEventsRaw,
    ] = await Promise.all([
      // Fetch all events within current range
      prisma.analyticsEvent.findMany({
        where: {
          createdAt: { gte: startDate, lte: now },
        },
        orderBy: { createdAt: "asc" },
      }),
      // Count pageviews in previous period for growth comparison
      prisma.analyticsEvent.count({
        where: {
          type: "pageview",
          createdAt: { gte: prevStartDate, lt: startDate },
        },
      }),
      // Get unique visitors in previous period
      prisma.analyticsEvent.findMany({
        where: {
          type: "pageview",
          createdAt: { gte: prevStartDate, lt: startDate },
        },
        distinct: ["visitorId"],
        select: { visitorId: true },
      }),
      // Get latest 10 live visitor events
      prisma.analyticsEvent.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          type: true,
          path: true,
          referrer: true,
          device: true,
          browser: true,
          createdAt: true,
        },
      }),
    ]);

    const pageviews = currentEvents.filter((e) => e.type === "pageview");
    const totalPageviews = pageviews.length;

    // Unique visitors set
    const uniqueVisitorSet = new Set(pageviews.map((e) => e.visitorId));
    const uniqueVisitors = uniqueVisitorSet.size;

    const prevVisitors = previousVisitorsRaw.length;
    const viewsGrowth = previousPageviewsCount > 0
      ? Math.round(((totalPageviews - previousPageviewsCount) / previousPageviewsCount) * 100)
      : totalPageviews > 0 ? 100 : 0;
    const visitorsGrowth = prevVisitors > 0
      ? Math.round(((uniqueVisitors - prevVisitors) / prevVisitors) * 100)
      : uniqueVisitors > 0 ? 100 : 0;

    // Conversions
    const whatsappClicks = currentEvents.filter((e) => e.type === "whatsapp_click").length;
    const chatbotOpens = currentEvents.filter((e) => e.type === "chatbot_open").length;

    // Device breakdown
    const deviceCounts: Record<string, number> = { mobile: 0, desktop: 0, tablet: 0 };
    pageviews.forEach((e) => {
      const dev = e.device.toLowerCase();
      if (dev in deviceCounts) {
        deviceCounts[dev]++;
      } else {
        deviceCounts.desktop++;
      }
    });

    const totalDev = totalPageviews || 1;
    const deviceBreakdown = [
      { name: "Mobile", count: deviceCounts.mobile, percentage: Math.round((deviceCounts.mobile / totalDev) * 100) },
      { name: "Desktop", count: deviceCounts.desktop, percentage: Math.round((deviceCounts.desktop / totalDev) * 100) },
      { name: "Tablet", count: deviceCounts.tablet, percentage: Math.round((deviceCounts.tablet / totalDev) * 100) },
    ];

    // Top Pages
    const pageCounts: Record<string, number> = {};
    pageviews.forEach((e) => {
      const cleanP = e.path || "/";
      pageCounts[cleanP] = (pageCounts[cleanP] || 0) + 1;
    });

    const topPages = Object.entries(pageCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 7)
      .map(([path, count]) => ({
        path,
        count,
        percentage: totalPageviews > 0 ? Math.round((count / totalPageviews) * 100) : 0,
      }));

    // Top Referrers
    const referrerCounts: Record<string, number> = {};
    pageviews.forEach((e) => {
      const ref = e.referrer || "Direct";
      referrerCounts[ref] = (referrerCounts[ref] || 0) + 1;
    });

    const topReferrers = Object.entries(referrerCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([source, count]) => ({
        source,
        count,
        percentage: totalPageviews > 0 ? Math.round((count / totalPageviews) * 100) : 0,
      }));

    // Trend Data for Chart
    const trendMap = new Map<string, { label: string; views: number; visitors: Set<string> }>();

    if (range === "24h") {
      // Group by hour
      for (let i = 23; i >= 0; i--) {
        const d = new Date(now.getTime() - i * 3600 * 1000);
        const hourStr = `${d.getHours().toString().padStart(2, "0")}:00`;
        const key = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}-${d.getHours()}`;
        trendMap.set(key, { label: hourStr, views: 0, visitors: new Set() });
      }

      pageviews.forEach((e) => {
        const d = new Date(e.createdAt);
        const key = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}-${d.getHours()}`;
        const item = trendMap.get(key);
        if (item) {
          item.views++;
          item.visitors.add(e.visitorId);
        }
      });
    } else {
      // Group by date (days)
      const dayCount = range === "30d" ? 30 : 7;
      for (let i = dayCount - 1; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
        const key = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
        trendMap.set(key, { label: dateStr, views: 0, visitors: new Set() });
      }

      pageviews.forEach((e) => {
        const d = new Date(e.createdAt);
        const key = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
        const item = trendMap.get(key);
        if (item) {
          item.views++;
          item.visitors.add(e.visitorId);
        }
      });
    }

    const trendData = Array.from(trendMap.values()).map((t) => ({
      label: t.label,
      views: t.views,
      visitors: t.visitors.size,
    }));

    return NextResponse.json({
      range,
      totalPageviews,
      uniqueVisitors,
      viewsGrowth,
      visitorsGrowth,
      whatsappClicks,
      chatbotOpens,
      deviceBreakdown,
      topPages,
      topReferrers,
      trendData,
      recentEvents: recentEventsRaw,
    });
  } catch (error) {
    console.error("Failed to load analytics dashboard data:", error);
    return NextResponse.json({ error: "Gagal mengambil data analitik" }, { status: 500 });
  }
}
