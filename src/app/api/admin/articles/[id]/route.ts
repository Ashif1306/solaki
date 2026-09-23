import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { DEFAULT_ARTICLES } from "@/lib/articles";

export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const article = await prisma.article.findUnique({
      where: { id },
    });

    if (article) {
      return NextResponse.json({ article });
    }

    const fallback = DEFAULT_ARTICLES.find((a) => a.id === id);
    if (fallback) {
      return NextResponse.json({ article: fallback });
    }

    return NextResponse.json({ error: "Article not found" }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const data = await req.json();

    let slug = data.slug
      ? data.slug.toLowerCase().trim().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-")
      : undefined;

    if (slug) {
      slug = slug.replace(/^-+|-+$/g, "");
    }

    // Check if updating a default item that isn't yet in DB (upsert pattern)
    const existing = await prisma.article.findUnique({ where: { id } }).catch(() => null);

    let updated;
    if (existing) {
      updated = await prisma.article.update({
        where: { id },
        data: {
          title: data.title !== undefined ? data.title.trim() : undefined,
          slug: slug || undefined,
          excerpt: data.excerpt !== undefined ? data.excerpt : undefined,
          content: data.content !== undefined ? data.content : undefined,
          coverImage: data.coverImage !== undefined ? data.coverImage : undefined,
          category: data.category !== undefined ? data.category : undefined,
          tags: Array.isArray(data.tags) ? data.tags : undefined,
          readTime: data.readTime !== undefined ? data.readTime : undefined,
          authorName: data.authorName !== undefined ? data.authorName : undefined,
          authorRole: data.authorRole !== undefined ? data.authorRole : undefined,
          authorAvatar: data.authorAvatar !== undefined ? data.authorAvatar : undefined,
          isPublished: data.isPublished !== undefined ? Boolean(data.isPublished) : undefined,
          isFeatured: data.isFeatured !== undefined ? Boolean(data.isFeatured) : undefined,
          viewCount: data.viewCount !== undefined ? Number(data.viewCount) : undefined,
        },
      });
    } else {
      // Upsert into DB
      const defaultItem = DEFAULT_ARTICLES.find((a) => a.id === id);
      updated = await prisma.article.create({
        data: {
          id,
          title: data.title || defaultItem?.title || "Artikel Baru",
          slug: slug || defaultItem?.slug || `artikel-${Date.now()}`,
          excerpt: data.excerpt !== undefined ? data.excerpt : defaultItem?.excerpt || "",
          content: data.content !== undefined ? data.content : defaultItem?.content || "",
          coverImage: data.coverImage || defaultItem?.coverImage || "/showcase/reels_kopi_enrekang.png",
          category: data.category || defaultItem?.category || "Tips UMKM",
          tags: Array.isArray(data.tags) ? data.tags : defaultItem?.tags || [],
          readTime: data.readTime || defaultItem?.readTime || "4 menit baca",
          authorName: data.authorName || defaultItem?.authorName || "Tim Edukasi SOLAKI",
          authorRole: data.authorRole || defaultItem?.authorRole || "Digital Strategist",
          authorAvatar: data.authorAvatar || defaultItem?.authorAvatar || "/logo_solaki/Logo_Solaki.png",
          isPublished: data.isPublished !== undefined ? Boolean(data.isPublished) : true,
          isFeatured: data.isFeatured !== undefined ? Boolean(data.isFeatured) : false,
          viewCount: data.viewCount !== undefined ? Number(data.viewCount) : 0,
        },
      });
    }

    return NextResponse.json({ success: true, article: updated });
  } catch (error) {
    console.error("Admin PUT article error:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    await prisma.article.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    // If it's a seed article not in DB, pretend success
    return NextResponse.json({ success: true });
  }
}
