import { NextResponse } from "next/server";
import { getArticleBySlug, incrementArticleViews, getRelatedArticles } from "@/lib/articles";

export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    if (!slug) {
      return NextResponse.json({ error: "Slug required" }, { status: 400 });
    }

    const article = await getArticleBySlug(slug);
    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    // Trigger view count increment asynchronously in background
    incrementArticleViews(slug).catch(() => {});

    // Also get 3 related articles
    const related = await getRelatedArticles(slug, article.category, 3);

    return NextResponse.json({ article, related });
  } catch (error) {
    console.error("API /api/articles/[slug] error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
