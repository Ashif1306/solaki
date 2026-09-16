import { safeMediaUrl, socialEmbedUrl } from "@/lib/showcase-media";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  try {
    const items = await prisma.socialShowcase.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });
    return NextResponse.json({ items });
  } catch (error) {
    console.error("Fetch showcase error:", error);
    return NextResponse.json({ items: [] });
  }
}

export async function POST(req: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Sesi admin berakhir, silakan login kembali." }, { status: 401 });
  }

  try {
    const data = await req.json();

    if (!String(data.title || "").trim() || (!safeMediaUrl(String(data.mediaUrl || "").trim()) && !socialEmbedUrl(String(data.postUrl || "").trim()))) {
      return NextResponse.json({ error: "Isi judul dan media atau tautan postingan Instagram/TikTok yang valid." }, { status: 400 });
    }

    const created = await prisma.socialShowcase.create({
      data: {
        order: Number(data.order) || 0,
        platform: data.platform === "tiktok" ? "tiktok" : "instagram",
        title: String(data.title).trim(),
        caption: String(data.caption || "").trim(),
        mediaUrl: String(data.mediaUrl || "").trim(),
        postUrl: data.postUrl ? String(data.postUrl).trim() : "",
        format: String(data.format || "Reels / Short Video"),
        
        // Metrics
        views: Number(data.views) || 0,
        likes: Number(data.likes) || 0,
        comments: Number(data.comments) || 0,
        shares: Number(data.shares) || 0,
        saves: Number(data.saves) || 0,
        engagementRate: String(data.engagementRate || "0%").trim(),
        reachMultiplier: String(data.reachMultiplier || "1.0x").trim(),

        // Analysis
        hookStrategy: String(data.hookStrategy || "").trim(),
        contentPillar: String(data.contentPillar || "Promosi & Edukasi").trim(),
        targetAudience: String(data.targetAudience || "Audiens Lokal").trim(),
        keyTakeaway: String(data.keyTakeaway || "").trim(),
        sentimentScore: String(data.sentimentScore || "98% Positif").trim(),

        isActive: data.isActive !== undefined ? Boolean(data.isActive) : true,
        isFeatured: data.isFeatured !== undefined ? Boolean(data.isFeatured) : false,
      },
    });

    return NextResponse.json({ success: true, item: created });
  } catch (error) {
    console.error("Create showcase error:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Sesi admin berakhir, silakan login kembali." }, { status: 401 });
  }

  try {
    const data = await req.json();

    if (!data.id) {
      return NextResponse.json({ error: "ID showcase wajib disertakan." }, { status: 400 });
    }

    const existing = await prisma.socialShowcase.findUnique({ where: { id: String(data.id) } });
    if (!existing) return NextResponse.json({ error: "Konten tidak ditemukan." }, { status: 404 });
    const media = String(data.mediaUrl ?? existing.mediaUrl).trim();
    const post = String(data.postUrl ?? existing.postUrl ?? "").trim();
    if (!safeMediaUrl(media) && !socialEmbedUrl(post)) return NextResponse.json({ error: "Isi media atau tautan postingan yang valid." }, { status: 400 });

    const updated = await prisma.socialShowcase.update({
      where: { id: String(data.id) },
      data: {
        ...(data.order !== undefined && { order: Number(data.order) }),
        ...(data.platform && { platform: data.platform === "tiktok" ? "tiktok" : "instagram" }),
        ...(data.title && { title: String(data.title).trim() }),
        ...(data.caption !== undefined && { caption: String(data.caption).trim() }),
        ...(data.mediaUrl !== undefined && { mediaUrl: String(data.mediaUrl || "").trim() }),
        ...(data.postUrl !== undefined && { postUrl: String(data.postUrl).trim() }),
        ...(data.format && { format: String(data.format) }),

        // Metrics
        ...(data.views !== undefined && { views: Number(data.views) }),
        ...(data.likes !== undefined && { likes: Number(data.likes) }),
        ...(data.comments !== undefined && { comments: Number(data.comments) }),
        ...(data.shares !== undefined && { shares: Number(data.shares) }),
        ...(data.saves !== undefined && { saves: Number(data.saves) }),
        ...(data.engagementRate !== undefined && { engagementRate: String(data.engagementRate).trim() }),
        ...(data.reachMultiplier !== undefined && { reachMultiplier: String(data.reachMultiplier).trim() }),

        // Analysis
        ...(data.hookStrategy !== undefined && { hookStrategy: String(data.hookStrategy).trim() }),
        ...(data.contentPillar !== undefined && { contentPillar: String(data.contentPillar).trim() }),
        ...(data.targetAudience !== undefined && { targetAudience: String(data.targetAudience).trim() }),
        ...(data.keyTakeaway !== undefined && { keyTakeaway: String(data.keyTakeaway).trim() }),
        ...(data.sentimentScore !== undefined && { sentimentScore: String(data.sentimentScore).trim() }),

        ...(data.isActive !== undefined && { isActive: Boolean(data.isActive) }),
        ...(data.isFeatured !== undefined && { isFeatured: Boolean(data.isFeatured) }),
      },
    });

    return NextResponse.json({ success: true, item: updated });
  } catch (error) {
    console.error("Update showcase error:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Sesi admin berakhir, silakan login kembali." }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID showcase wajib disertakan." }, { status: 400 });
    }

    await prisma.socialShowcase.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete showcase error:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
