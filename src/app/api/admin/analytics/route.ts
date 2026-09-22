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
  const tzParam = searchParams.get("tz") || "Asia/Makassar";

  let targetTimezone = "Asia/Makassar";
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: tzParam }).format(new Date());
    targetTimezone = tzParam;
  } catch {
    targetTimezone = "Asia/Makassar";
  }

  const now = new Date();
  let startDate = new Date();
  let prevStartDate = new Date();

  if (range === "24h") {
    startDate = new Date(now.getTime() - 24 * 3600 * 1000);
    prevStartDate = new Date(now.getTime() - 48 * 3600 * 1000);
  } else if (range === "30d") {
    startDate = new Date(now.getTime() - 30 * 86400 * 1000);
    prevStartDate = new Date(now.getTime() - 60 * 86400 * 1000);
  } else if (range === "all") {
    startDate = new Date(2025, 0, 1);
    prevStartDate = new Date(2024, 0, 1);
  } else {
    // Default: 7d
    startDate = new Date(now.getTime() - 7 * 86400 * 1000);
    prevStartDate = new Date(now.getTime() - 14 * 86400 * 1000);
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

    // Conversions & Action Analysis (Layer 2 & Layer 4 - Pertemuan II.pdf)
    const whatsappClicks = currentEvents.filter((e) => e.type === "whatsapp_click").length;
    const chatbotOpens = currentEvents.filter((e) => e.type === "chatbot_open").length;
    const totalEngagements = whatsappClicks + chatbotOpens;

    const baseDenom = totalPageviews || 1;
    const er = Number(((totalEngagements / baseDenom) * 100).toFixed(2));
    const ctr = Number(((whatsappClicks / baseDenom) * 100).toFixed(2));
    const conversionRate = Number(((whatsappClicks / (uniqueVisitors || 1)) * 100).toFixed(2));

    let interpretation = "";
    if (ctr >= 1.5 && er >= 3.0) {
      interpretation =
        "Keseimbangan Ideal: Nilai ER dan CTR berada di atas rata-rata benchmark industri UMKM. Konten menarik dan CTA sangat efektif mengarahkan pengunjung ke aksi konversi.";
    } else if (ctr >= 1.5 && er < 3.0) {
      interpretation =
        "Konten memiliki Call-to-Action (CTA) yang sangat kuat dan efektif, namun keterlibatan visual/cerita konten masih dapat ditingkatkan agar pengunjung lebih lama mengeksplorasi web.";
    } else if (ctr < 1.5 && er >= 3.0) {
      interpretation =
        "Pengunjung aktif berinteraksi dengan konten, namun dorongan aksi menuju WhatsApp/CTA perlu diperjelas dengan penawaran atau copywriting yang lebih persuasif.";
    } else {
      interpretation =
        "Konten dan Call-to-Action perlu dioptimalkan agar lebih persuasif dan memicu interaksi sesuai standar UMKM (Target ER: 3-6%, Target CTR: >1.5%).";
    }

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

    // Timezone-aware date and hour formatters
    const getHourKey = (date: Date) => {
      const hourStr = new Intl.DateTimeFormat("id-ID", {
        timeZone: targetTimezone,
        hour: "2-digit",
        hour12: false,
      }).format(date);
      const datePart = new Intl.DateTimeFormat("en-CA", {
        timeZone: targetTimezone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(date);
      return { key: `${datePart}-${hourStr}`, label: `${hourStr}:00` };
    };

    const getDayKey = (date: Date) => {
      const dateLabel = date.toLocaleDateString("id-ID", {
        timeZone: targetTimezone,
        day: "numeric",
        month: "short",
      });
      const datePart = new Intl.DateTimeFormat("en-CA", {
        timeZone: targetTimezone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(date);
      return { key: datePart, label: dateLabel };
    };

    // Trend Data for Chart
    const trendMap = new Map<string, { label: string; views: number; visitors: Set<string> }>();

    if (range === "24h") {
      // Group by hour in target timezone
      for (let i = 23; i >= 0; i--) {
        const d = new Date(now.getTime() - i * 3600 * 1000);
        const { key, label } = getHourKey(d);
        trendMap.set(key, { label, views: 0, visitors: new Set() });
      }

      pageviews.forEach((e) => {
        const d = new Date(e.createdAt);
        const { key } = getHourKey(d);
        const item = trendMap.get(key);
        if (item) {
          item.views++;
          item.visitors.add(e.visitorId);
        }
      });
    } else {
      // Group by date (days) in target timezone
      const dayCount = range === "30d" ? 30 : 7;
      for (let i = dayCount - 1; i >= 0; i--) {
        const d = new Date(now.getTime() - i * 86400 * 1000);
        const { key, label } = getDayKey(d);
        trendMap.set(key, { label, views: 0, visitors: new Set() });
      }

      pageviews.forEach((e) => {
        const d = new Date(e.createdAt);
        const { key } = getDayKey(d);
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
      timezone: targetTimezone,
      totalPageviews,
      uniqueVisitors,
      viewsGrowth,
      visitorsGrowth,
      whatsappClicks,
      chatbotOpens,
      totalEngagements,
      er,
      ctr,
      conversionRate,
      interpretation,
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
