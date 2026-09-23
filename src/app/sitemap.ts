import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";
import { getArticles } from "@/lib/articles";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  try {
    const articles = await getArticles();
    for (const article of articles) {
      routes.push({
        url: `${siteUrl}/blog/${article.slug}`,
        lastModified: new Date(article.updatedAt || article.publishedAt),
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }
  } catch (err) {
    console.warn("Sitemap articles fetch failed:", err);
  }

  return routes;
}
