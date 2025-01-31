// app/sitemap.ts

export const runtime = 'edge';

type SitemapEntry = {
  url: string;
  lastModified: string;
  changeFrequency:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  priority?: number;
};

export default async function sitemap(): Promise<SitemapEntry[]> {
  const baseUrl = "";

  // Generate sitemap entries for static pages
  const staticPagesEntries: SitemapEntry[] = [
    {
      url: baseUrl,
      lastModified: "2024-12-22T16:50:49+00:00",
      changeFrequency: "monthly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: "2024-12-22T16:50:49+00:00",
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/terms-of-service`,
      lastModified: "2024-12-22T16:50:49+00:00",
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/support`,
      lastModified: "2024-12-22T16:50:49+00:00",
      changeFrequency: "monthly",
      priority: 0.8,
    }
  ];

  return staticPagesEntries;
}