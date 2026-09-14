import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import MetricLog from "@/models/MetricLog";

// Fallback mock data jika belum ada data di DB
const mockMetrics = {
  instagram: {
    platform: "instagram",
    partnerName: "Warung Karaeng Pitu",
    periodLabel: "Agustus 2024",
    metrics: [
      {
        key: "reach",
        label: "Total Reach",
        value: 48200,
        unit: "akun",
        trend: 23.4,
        weeklyData: [
          { week: "W1", value: 8200 },
          { week: "W2", value: 10500 },
          { week: "W3", value: 13800 },
          { week: "W4", value: 15700 },
        ],
      },
      {
        key: "engagementRate",
        label: "Engagement Rate",
        value: 7.8,
        unit: "%",
        trend: 1.2,
        weeklyData: [
          { week: "W1", value: 6.1 },
          { week: "W2", value: 7.0 },
          { week: "W3", value: 8.2 },
          { week: "W4", value: 9.9 },
        ],
      },
      {
        key: "saveRate",
        label: "Save Rate",
        value: 4.3,
        unit: "%",
        trend: 0.8,
        weeklyData: [
          { week: "W1", value: 3.2 },
          { week: "W2", value: 3.8 },
          { week: "W3", value: 4.5 },
          { week: "W4", value: 5.7 },
        ],
      },
      {
        key: "shareRate",
        label: "Share Rate",
        value: 2.9,
        unit: "%",
        trend: 0.5,
        weeklyData: [
          { week: "W1", value: 2.1 },
          { week: "W2", value: 2.5 },
          { week: "W3", value: 3.1 },
          { week: "W4", value: 3.9 },
        ],
      },
    ],
  },
  tiktok: {
    platform: "tiktok",
    partnerName: "Warung Karaeng Pitu",
    periodLabel: "Agustus 2024",
    metrics: [
      {
        key: "videoViews",
        label: "Video Views",
        value: 124500,
        unit: "views",
        trend: 41.2,
        weeklyData: [
          { week: "W1", value: 18000 },
          { week: "W2", value: 27500 },
          { week: "W3", value: 36000 },
          { week: "W4", value: 43000 },
        ],
      },
      {
        key: "avgWatchTime",
        label: "Avg Watch Time (0-3s)",
        value: 2.7,
        unit: "detik",
        trend: 0.3,
        weeklyData: [
          { week: "W1", value: 2.1 },
          { week: "W2", value: 2.4 },
          { week: "W3", value: 2.8 },
          { week: "W4", value: 3.5 },
        ],
      },
      {
        key: "completionRate",
        label: "Completion Rate",
        value: 68.4,
        unit: "%",
        trend: 5.1,
        weeklyData: [
          { week: "W1", value: 58.2 },
          { week: "W2", value: 64.1 },
          { week: "W3", value: 70.3 },
          { week: "W4", value: 81.0 },
        ],
      },
      {
        key: "engagementRate",
        label: "Engagement Rate",
        value: 9.2,
        unit: "%",
        trend: 2.1,
        weeklyData: [
          { week: "W1", value: 6.8 },
          { week: "W2", value: 8.2 },
          { week: "W3", value: 9.9 },
          { week: "W4", value: 11.9 },
        ],
      },
    ],
  },
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const platform = searchParams.get("platform") as "instagram" | "tiktok" | null;

  try {
    await connectDB();

    const query = platform ? { platform } : {};
    const logs = await MetricLog.find(query)
      .sort({ periodStart: -1 })
      .limit(2)
      .lean();

    if (logs.length === 0) {
      // Return mock data jika DB kosong
      if (platform) {
        return NextResponse.json({ data: mockMetrics[platform], source: "mock" });
      }
      return NextResponse.json({
        data: Object.values(mockMetrics),
        source: "mock",
      });
    }

    return NextResponse.json({ data: logs, source: "database" });
  } catch (error) {
    console.error("Metrics API error:", error);
    // Fallback ke mock data
    if (platform && mockMetrics[platform]) {
      return NextResponse.json({ data: mockMetrics[platform], source: "mock-fallback" });
    }
    return NextResponse.json(
      { error: "Gagal mengambil data metrik" },
      { status: 500 }
    );
  }
}
