import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  // Only canonical public pages; hash sections are not separate pages.
  return [{ url: `${siteUrl}/` }];
}
