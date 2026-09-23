import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { DEFAULT_ARTICLES } from "@/lib/articles";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const articles = await prisma.article.findMany({
      orderBy: { createdAt: "desc" },
    });

    if (articles.length > 0) {
      return NextResponse.json({ articles });
    }
  } catch (err) {
    console.warn("Prisma admin articles GET error, returning defaults:", err);
  }

  return NextResponse.json({ articles: DEFAULT_ARTICLES });
}

export async function POST(req: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await req.json();

    if (!data.title || !data.title.trim()) {
      return NextResponse.json({ error: "Judul artikel wajib diisi" }, { status: 400 });
    }

    // Generate or sanitize slug
    let slug = data.slug
      ? data.slug.toLowerCase().trim().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-")
      : data.title
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9-]/g, "-")
          .replace(/-+/g, "-");

    // Make sure slug doesn't start or end with hyphen
    slug = slug.replace(/^-+|-+$/g, "");

    const created = await prisma.article.create({
      data: {
        slug,
        title: data.title.trim(),
        excerpt: data.excerpt || "",
        content: data.content || "",
        coverImage: data.coverImage || "/showcase/reels_kopi_enrekang.png",
        category: data.category || "Tips UMKM",
        tags: Array.isArray(data.tags) ? data.tags : [],
        readTime: data.readTime || "4 menit baca",
        authorName: data.authorName || "Tim Edukasi SOLAKI",
        authorRole: data.authorRole || "Digital Strategist",
        authorAvatar: data.authorAvatar || "/logo_solaki/Logo_Solaki.png",
        isPublished: data.isPublished ?? true,
        isFeatured: Boolean(data.isFeatured),
        viewCount: Number(data.viewCount) || 0,
        publishedAt: data.publishedAt ? new Date(data.publishedAt) : new Date(),
      },
    });

    return NextResponse.json({ success: true, article: created });
  } catch (error) {
    console.error("Admin POST article error:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
