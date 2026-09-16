import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

// PUT /api/admin/showcase/update-metrics
// Body: { id: string }
// Re-fetches Instagram insights for a single showcase item using its postUrl
export async function PUT(req: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Sesi admin berakhir, silakan login kembali." }, { status: 401 });
  }

  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;

  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "ID konten wajib diisi." }, { status: 400 });
    }

    const item = await prisma.socialShowcase.findUnique({ where: { id } });
    if (!item) {
      return NextResponse.json({ error: "Konten tidak ditemukan." }, { status: 404 });
    }

    // If no Instagram token, just return current data
    if (!accessToken || item.platform !== "instagram" || !item.postUrl) {
      return NextResponse.json({
        success: false,
        error: "Token Instagram belum dikonfigurasi atau konten bukan dari Instagram.",
        item,
      });
    }

    // Extract media ID from permalink
    // Format: https://www.instagram.com/p/ABC123/ or /reel/ABC123/
    const match = item.postUrl.match(/\/(p|reel|reels)\/([A-Za-z0-9_-]+)/);
    if (!match) {
      return NextResponse.json({ error: "Tidak dapat mengekstrak media ID dari URL postingan." }, { status: 400 });
    }

    const mediaShortcode = match[2];

    // First, find the media ID from the user's media list
    const igUserId = process.env.INSTAGRAM_USER_ID;
    if (!igUserId) {
      return NextResponse.json({ error: "INSTAGRAM_USER_ID belum dikonfigurasi." }, { status: 400 });
    }

    // Search through user media to find the matching post
    const searchUrl = `https://graph.instagram.com/${igUserId}/media?fields=id,permalink&limit=50&access_token=${accessToken}`;
    const searchRes = await fetch(searchUrl, { cache: "no-store" });

    if (!searchRes.ok) {
      const err = await searchRes.json().catch(() => ({}));
      return NextResponse.json({ error: `Instagram API error: ${(err as Record<string, {message?: string}>)?.error?.message || "Unknown"}` }, { status: 400 });
    }

    const searchData = await searchRes.json();
    const mediaList = (searchData.data || []) as Array<{ id: string; permalink: string }>;
    const foundMedia = mediaList.find((m) => m.permalink.includes(mediaShortcode));

    if (!foundMedia) {
      return NextResponse.json({ error: "Postingan tidak ditemukan di akun Instagram yang terhubung." }, { status: 404 });
    }

    // Fetch insights for this media
    const insightFields = "like_count,comments_count,media_type,timestamp";
    const insightMetrics = "reach,saved,shares,impressions,video_views";
    const mediaUrl = `https://graph.instagram.com/${foundMedia.id}?fields=${insightFields}&access_token=${accessToken}`;
    const insightsUrl = `https://graph.instagram.com/${foundMedia.id}/insights?metric=${insightMetrics}&access_token=${accessToken}`;

    const [mediaRes, insightsRes] = await Promise.allSettled([
      fetch(mediaUrl, { cache: "no-store" }),
      fetch(insightsUrl, { cache: "no-store" }),
    ]);

    let likes = item.likes;
    let comments = item.comments;
    let reach = 0;
    let saves = item.saves;
    let shares = item.shares;
    let videoViews = item.views;

    if (mediaRes.status === "fulfilled" && mediaRes.value.ok) {
      const mData = await mediaRes.value.json();
      likes = Number(mData.like_count) || likes;
      comments = Number(mData.comments_count) || comments;
    }

    if (insightsRes.status === "fulfilled" && insightsRes.value.ok) {
      const iData = await insightsRes.value.json();
      for (const metric of (iData.data || [])) {
        const val = metric?.values?.[0]?.value ?? metric?.value ?? 0;
        switch (metric.name) {
          case "reach": reach = Number(val); break;
          case "saved": saves = Number(val); break;
          case "shares": shares = Number(val); break;
          case "video_views": videoViews = Number(val); break;
        }
      }
    }

    // Calculate engagement rate
    const interactions = likes + comments + saves + shares;
    const base = Math.max(reach || videoViews || likes, 1);
    const er = ((interactions / base) * 100).toFixed(1) + "%";

    const updated = await prisma.socialShowcase.update({
      where: { id },
      data: {
        likes,
        comments,
        saves,
        shares,
        views: videoViews || reach || item.views,
        engagementRate: er,
        reachMultiplier: reach > 0 ? `${(reach / Math.max(likes, 1)).toFixed(1)}x Reach` : item.reachMultiplier,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Metrik berhasil diperbarui dari Instagram API.`,
      item: updated,
      synced: { likes, comments, saves, shares, reach, videoViews, er },
    });
  } catch (error) {
    console.error("Update metrics error:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
