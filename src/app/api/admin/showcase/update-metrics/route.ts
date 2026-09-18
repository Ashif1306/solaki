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

    const isFacebookToken = accessToken.startsWith("EAA");
    const graphBase = isFacebookToken ? "https://graph.facebook.com/v22.0" : "https://graph.instagram.com";

    // Search through user media to find the matching post
    const searchUrl = `${graphBase}/${igUserId}/media?fields=id,permalink&limit=50&access_token=${accessToken}`;
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
    const mediaUrl = `${graphBase}/${foundMedia.id}?fields=${insightFields}&access_token=${accessToken}`;
    
    // Check media type from user's media or item
    const isVideo = item.format.toLowerCase().includes("reel") || item.format.toLowerCase().includes("video");
    const insightMetrics = isVideo
      ? "reach,saved,shares,views,total_interactions"
      : "reach,saved,shares,views,total_interactions,profile_visits";
    const insightsUrl = `${graphBase}/${foundMedia.id}/insights?metric=${insightMetrics}&access_token=${accessToken}`;

    const [mediaRes, insightsRes] = await Promise.allSettled([
      fetch(mediaUrl, { cache: "no-store" }),
      fetch(insightsUrl, { cache: "no-store" }),
    ]);

    let likes = item.likes;
    let comments = item.comments;
    let reach = 0;
    let saves = item.saves;
    let shares = item.shares;
    let views = item.views;
    let profileVisits = 0;
    let totalInteractions = 0;

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
          case "views": views = Number(val); break;
          case "profile_visits": profileVisits = Number(val); break;
          case "total_interactions": totalInteractions = Number(val); break;
        }
      }
    }

    // Fetch followers count for ER calculation
    let followersCount = 0;
    try {
      const pUrl = isFacebookToken
        ? `https://graph.facebook.com/v22.0/${igUserId}?fields=followers_count&access_token=${accessToken}`
        : `https://graph.instagram.com/me?fields=followers_count&access_token=${accessToken}`;
      const pRes = await fetch(pUrl, { cache: "no-store" });
      if (pRes.ok) {
        const pData = await pRes.json();
        followersCount = Number(pData.followers_count) || 0;
      }
    } catch {}

    // Calculate engagement rate by followers
    const interactions = totalInteractions > 0 ? totalInteractions : (likes + comments + saves + shares);
    const erDenominator = followersCount > 0 ? followersCount : Math.max(reach || views || likes, 1);
    const er = ((interactions / erDenominator) * 100).toFixed(2) + "%";

    // Calculate CTR (Click-Through / Conversion Action Rate)
    const conversionActions = saves + shares + profileVisits;
    const ctrDenominator = Math.max(views || reach || (likes * 10), 1);
    const ctr = `${((conversionActions / ctrDenominator) * 100).toFixed(2)}% CTR`;

    const updated = await prisma.socialShowcase.update({
      where: { id },
      data: {
        likes,
        comments,
        saves,
        shares,
        views: views || reach || item.views,
        engagementRate: er,
        reachMultiplier: ctr,
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
