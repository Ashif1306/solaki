import { NextResponse } from "next/server";
import { getArticles } from "@/lib/articles";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || undefined;
    const category = searchParams.get("category") || undefined;
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : undefined;

    const articles = await getArticles({ search, category, limit });
    return NextResponse.json({ articles });
  } catch (error) {
    console.error("API /api/articles error:", error);
    return NextResponse.json({ articles: [] }, { status: 500 });
  }
}
