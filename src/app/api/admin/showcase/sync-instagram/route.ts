import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Sesi admin berakhir, silakan login kembali." }, { status: 401 });
  }

  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  const igUserId = process.env.INSTAGRAM_USER_ID;

  if (!accessToken || !igUserId) {
    return NextResponse.json(
      { error: "Token Instagram belum dikonfigurasi. Tambahkan INSTAGRAM_ACCESS_TOKEN dan INSTAGRAM_USER_ID di .env.local", setup: true },
      { status: 400 }
    );
  }

  try {
    const isFacebookToken = accessToken.startsWith("EAA");
    const graphBase = isFacebookToken ? "https://graph.facebook.com/v22.0" : "https://graph.instagram.com";

    const fields = "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,like_count,comments_count";
    const apiUrl = `${graphBase}/${igUserId}/media?fields=${fields}&limit=20&access_token=${accessToken}`;
    const mediaListRes = await fetch(apiUrl, { cache: "no-store" });

    if (!mediaListRes.ok) {
      const errData = await mediaListRes.json().catch(() => ({}));
      const msg = (errData as Record<string, {message?: string}>)?.error?.message || mediaListRes.statusText;
      return NextResponse.json({ error: `Instagram API error: ${msg}` }, { status: 400 });
    }

    const mediaList = await mediaListRes.json();
    const posts = (mediaList.data || []) as Record<string, unknown>[];
    if (posts.length === 0) {
      return NextResponse.json({ success: true, synced: 0, message: "Tidak ada postingan terbaru ditemukan." });
    }

    // ── Fetch Account Profile for Followers Count ───────────────
    let followersCount = 0;
    try {
      const profileUrl = isFacebookToken
        ? `https://graph.facebook.com/v22.0/${igUserId}?fields=id,name,username,followers_count,follows_count,media_count&access_token=${accessToken}`
        : `https://graph.instagram.com/me?fields=id,username,followers_count,media_count&access_token=${accessToken}`;
      const profileRes = await fetch(profileUrl, { cache: "no-store" });
      if (profileRes.ok) {
        const profileData = await profileRes.json();
        followersCount = Number(profileData.followers_count) || 0;
      }
    } catch (err) {
      console.warn("Could not fetch Instagram account profile:", err);
    }

    let synced = 0;
    let updated = 0;

    for (const post of posts) {
      const mediaId = post.id as string;
      const mediaType = post.media_type as string;
      const permalink = post.permalink as string;
      const caption = (post.caption as string) || "";
      const rawMediaUrl = (post.media_url as string) || "";
      const thumbnailUrl = (post.thumbnail_url as string) || rawMediaUrl;
      const likeCount = Number(post.like_count) || 0;
      const commentsCount = Number(post.comments_count) || 0;

      const format =
        mediaType === "VIDEO" ? "Instagram Reels (9:16)"
        : mediaType === "CAROUSEL_ALBUM" ? "Instagram Carousel"
        : "Instagram Feed";

      // ── Fetch insights per media (Graph API v22.0) ───────────
      let reach = 0;
      let saves = 0;
      let shares = 0;
      let views = 0;
      let profileVisits = 0;
      let totalInteractions = 0;

      try {
        const insightMetrics = mediaType === "VIDEO"
          ? "reach,saved,shares,views,total_interactions"
          : "reach,saved,shares,views,total_interactions,profile_visits";

        const insightsUrl = `${graphBase}/${mediaId}/insights?metric=${insightMetrics}&access_token=${accessToken}`;
        const insightsRes = await fetch(insightsUrl, { cache: "no-store" });

        if (insightsRes.ok) {
          const insightsData = await insightsRes.json();
          for (const metric of (insightsData.data || [])) {
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
      } catch (err) {
        console.warn("Media insights fetch error:", err);
      }

      // ── Calculate ER (Engagement Rate by Followers) ─────────────
      // Rumus Standar Industri: ER = (Total Interaksi / Total Followers) × 100%
      const interactions = totalInteractions > 0 ? totalInteractions : (likeCount + commentsCount + saves + shares);
      const erDenominator = followersCount > 0
        ? followersCount
        : (reach > 0 ? reach : (views > 0 ? views : Math.max(likeCount * 10, 1)));
      const erValue = (interactions / erDenominator) * 100;
      const er = `${erValue.toFixed(2)}%`;

      // ── Calculate CTR (Click-Through / Action Rate) ─────────────
      // CTR pada konten organik = Tindakan klik/konversi (Kunjungan Profil + Simpan + Bagikan) / Views × 100%
      const conversionActions = saves + shares + profileVisits;
      const ctrDenominator = Math.max(views || reach || (likeCount * 10), 1);
      const ctrValue = (conversionActions / ctrDenominator) * 100;
      const ctr = `${ctrValue.toFixed(2)}% CTR`;

      const existing = await prisma.socialShowcase.findFirst({ where: { postUrl: permalink } });

      if (existing) {
        await prisma.socialShowcase.update({
          where: { id: existing.id },
          data: {
            likes: likeCount,
            comments: commentsCount,
            saves,
            shares,
            views: views || reach || existing.views,
            engagementRate: er,
            reachMultiplier: ctr,
            mediaUrl: thumbnailUrl || existing.mediaUrl,
          },
        });
        updated++;
        continue;
      }

      const firstLine = caption.split("\n")[0].replace(/#\S+/g, "").trim();
      const titleFromCaption = firstLine.slice(0, 80) || "Konten Instagram SOLAKI";
      const currentCount = await prisma.socialShowcase.count();

      await prisma.socialShowcase.create({
        data: {
          platform: "instagram",
          title: titleFromCaption,
          caption: caption.slice(0, 500),
          mediaUrl: thumbnailUrl,
          postUrl: permalink,
          format,
          likes: likeCount,
          comments: commentsCount,
          views: views || reach,
          shares,
          saves,
          engagementRate: er,
          reachMultiplier: ctr,
          hookStrategy: "",
          contentPillar: "Promosi & Branding",
          targetAudience: "Audiens Lokal",
          keyTakeaway: "",
          sentimentScore: "",
          isActive: true,
          isFeatured: false,
          order: currentCount + 1,
        },
      });
      synced++;
    }

    return NextResponse.json({
      success: true,
      synced,
      updated,
      total: posts.length,
      message: `${synced} konten baru ditambahkan, ${updated} konten diperbarui metriknya (termasuk reach, saves & shares).`,
    });
  } catch (error) {
    console.error("Instagram sync error:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  const igUserId = process.env.INSTAGRAM_USER_ID;

  if (!accessToken || !igUserId) {
    return NextResponse.json({ configured: false });
  }

  try {
    const isFacebookToken = accessToken.startsWith("EAA");
    const meUrl = isFacebookToken
      ? `https://graph.facebook.com/v22.0/${igUserId}?fields=id,name,username,followers_count,follows_count,media_count,profile_picture_url&access_token=${accessToken}`
      : `https://graph.instagram.com/me?fields=id,name,username,account_type,media_count&access_token=${accessToken}`;
    const res = await fetch(meUrl, { cache: "no-store" });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return NextResponse.json({
        configured: true,
        valid: false,
        error: err?.error?.message || "Token tidak valid atau sudah kadaluarsa.",
      });
    }

    const data = await res.json();
    return NextResponse.json({
      configured: true,
      valid: true,
      account: {
        id: data.id,
        name: data.name || data.username,
        username: data.username || data.name,
        accountType: data.account_type || "BUSINESS",
        mediaCount: data.media_count,
        followersCount: data.followers_count || 0,
        followsCount: data.follows_count || 0,
        profilePictureUrl: data.profile_picture_url || "",
      },
    });
  } catch (error) {
    return NextResponse.json({ configured: true, valid: false, error: (error as Error).message });
  }
}
