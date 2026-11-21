import type { MetadataRoute } from "next";
import { isProduction, siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  if (!isProduction) return [];

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
