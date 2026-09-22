import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const items = await prisma.socialShowcase.findMany({
      where: { isActive: true },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });

    // ── Optionally fetch account followers from Instagram ───────
    let followersCount = 0;
    const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
    const igUserId = process.env.INSTAGRAM_USER_ID;
    if (accessToken && igUserId) {
      try {
        const isFacebookToken = accessToken.startsWith("EAA");
        const profileUrl = isFacebookToken
          ? `https://graph.facebook.com/v22.0/${igUserId}?fields=followers_count&access_token=${accessToken}`
          : `https://graph.instagram.com/me?fields=followers_count&access_token=${accessToken}`;
        const pRes = await fetch(profileUrl, { cache: "no-store" });
        if (pRes.ok) {
          const pData = await pRes.json();
          followersCount = Number(pData.followers_count) || 0;
        }
      } catch {
        // Ignore fetch errors
      }
    }

    // ── Aggregate stats ──────────────────────────────────────────
    const totalViews = items.reduce((s, i) => s + (i.views || 0), 0);
    const totalLikes = items.reduce((s, i) => s + (i.likes || 0), 0);
    const totalComments = items.reduce((s, i) => s + (i.comments || 0), 0);
    const totalShares = items.reduce((s, i) => s + (i.shares || 0), 0);
    const totalSaves = items.reduce((s, i) => s + (i.saves || 0), 0);
    const totalInteractions = totalLikes + totalComments + totalShares + totalSaves;

    // Average ER across all posts
    // Formula standard: (Total Interactions / (Followers * Posts)) * 100%
    let avgER = "0.00";
    if (followersCount > 0 && items.length > 0) {
      avgER = ((totalInteractions / (followersCount * items.length)) * 100).toFixed(2);
    } else {
      const erValues = items
        .map((i) => parseFloat((i.engagementRate || "0").replace(/[^0-9.]/g, "")))
        .filter((v) => v > 0);
      avgER =
        erValues.length > 0
          ? (erValues.reduce((s, v) => s + v, 0) / erValues.length).toFixed(2)
          : "0.00";
    }

    // Average CTR across all posts (stored in reachMultiplier field)
    const ctrValues = items
      .map((i) => parseFloat((i.reachMultiplier || "0").replace(/[^0-9.]/g, "")))
      .filter((v) => v > 0);
    const avgCTR =
      ctrValues.length > 0
        ? (ctrValues.reduce((s, v) => s + v, 0) / ctrValues.length).toFixed(2)
        : "0.00";

    // Amplification Rate & Conversation Rate (Slide 18 & 20 - Pertemuan II.pdf)
    const postCount = Math.max(items.length, 1);
    const denom = followersCount > 0 ? followersCount : Math.max(totalViews / postCount, 1);
    const avgSharesPerPost = totalShares / postCount;
    const avgCommentsPerPost = totalComments / postCount;

    const amplificationRate = ((avgSharesPerPost / denom) * 100).toFixed(2);
    const conversationRate = ((avgCommentsPerPost / denom) * 100).toFixed(2);

    let interpretation = "";
    const erNum = parseFloat(avgER);
    const ctrNum = parseFloat(avgCTR);

    if (ctrNum >= 1.5 && erNum >= 3.0) {
      interpretation =
        "Keseimbangan Ideal: Nilai ER dan CTR berada di atas rata-rata benchmark industri UMKM. Konten menarik dan CTA sangat efektif.";
    } else if (ctrNum >= 1.5 && erNum < 3.0) {
      interpretation =
        "Konten memiliki CTA/ajakan aksi yang efektif, namun storytelling dan estetika visual perlu ditingkatkan untuk mendongkrak engagement.";
    } else if (ctrNum < 1.5 && erNum >= 3.0) {
      interpretation =
        "Audiens menyukai dan menikmati konten Anda, namun kurang terdorong untuk mengklik link/CTA. Perjelas penawaran di bio & story.";
    } else {
      interpretation =
        "Perlu optimasi format konten visual (carousel edukasi & reels) serta ajakan aksi terarah untuk mencapai standar benchmark UMKM (ER: 3-6%).";
    }

    // ── Per-post breakdown with computed ER & CTR ────────────────
    const postsBreakdown = items.map((item) => {
      const interactions = (item.likes || 0) + (item.comments || 0) + (item.saves || 0) + (item.shares || 0);
      const erDenominator = followersCount > 0
        ? followersCount
        : Math.max(item.views || item.likes * 10, 1);
      
      // Use stored ER if available and formatted, otherwise recalculate
      const parsedStoredER = parseFloat((item.engagementRate || "").replace(/[^0-9.]/g, ""));
      const erNum = !isNaN(parsedStoredER) && parsedStoredER > 0 && followersCount === 0
        ? parsedStoredER
        : parseFloat(((interactions / erDenominator) * 100).toFixed(2));
      const erStr = `${erNum.toFixed(2)}%`;

      const storedCTR = parseFloat((item.reachMultiplier || "").replace(/[^0-9.]/g, ""));
      const viewBase = Math.max(item.views || (item.likes * 10), 1);
      const ctrNum = !isNaN(storedCTR) && storedCTR > 0
        ? storedCTR
        : parseFloat((((item.saves || 0) + (item.shares || 0)) / viewBase * 100).toFixed(2));
      const ctrStr = `${ctrNum.toFixed(2)}%`;

      return {
        id: item.id,
        title: item.title,
        caption: item.caption,
        platform: item.platform,
        format: item.format,
        mediaUrl: item.mediaUrl,
        postUrl: item.postUrl,
        views: item.views,
        likes: item.likes,
        comments: item.comments,
        shares: item.shares,
        saves: item.saves,
        er: erNum,
        ctr: ctrNum,
        erStr,
        ctrStr,
        isFeatured: item.isFeatured,
        createdAt: item.createdAt,
      };
    });

    // ── Top performers ──────────────────────────────────────────
    const sortedByER = [...postsBreakdown].sort((a, b) => b.er - a.er);
    const sortedByViews = [...postsBreakdown].sort((a, b) => b.views - a.views);
    const sortedByLikes = [...postsBreakdown].sort((a, b) => b.likes - a.likes);

    const topER = sortedByER.slice(0, 3);
    const topViews = sortedByViews.slice(0, 3);
    const topLikes = sortedByLikes.slice(0, 3);

    // ── Format distribution ─────────────────────────────────────
    const formatCounts: Record<string, number> = {};
    for (const item of items) {
      const key = /reel/i.test(item.format)
        ? "Reels / Video"
        : /carousel/i.test(item.format)
        ? "Carousel"
        : "Feed / Foto";
      formatCounts[key] = (formatCounts[key] || 0) + 1;
    }

    const formatDistribution = Object.entries(formatCounts).map(([name, count]) => ({
      name,
      count,
      percentage: items.length > 0 ? Math.round((count / items.length) * 100) : 0,
    }));

    return NextResponse.json({
      aggregate: {
        totalPosts: items.length,
        totalViews,
        totalLikes,
        totalComments,
        totalShares,
        totalSaves,
        totalInteractions,
        followersCount,
        avgER: `${avgER}%`,
        avgCTR: `${avgCTR}%`,
        amplificationRate: `${amplificationRate}%`,
        conversationRate: `${conversationRate}%`,
        interpretation,
      },
      posts: postsBreakdown,
      topPerformers: {
        byER: topER,
        byViews: topViews,
        byLikes: topLikes,
      },
      formatDistribution,
    });
  } catch (error) {
    console.error("Insights API error:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
