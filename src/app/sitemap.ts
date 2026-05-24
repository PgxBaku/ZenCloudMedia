import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = "https://www.zencloudweb.com";
  const lastModified = new Date();
  const routes = [
    { path: "", priority: 1 },
    { path: "/about", priority: 0.85 },
    { path: "/reels", priority: 0.9 },
    { path: "/pgx/resume", priority: 0.8 },
    { path: "/pgx/resume/ats", priority: 0.7 },
    { path: "/pgx/resume/text", priority: 0.6 },
    { path: "/pgx/resume/story", priority: 0.55 },
    { path: "/editorial-policy", priority: 0.75 },
    { path: "/contact", priority: 0.75 },
    { path: "/privacy", priority: 0.65 },
    { path: "/terms", priority: 0.65 },
  ];

  return routes.map((route) => ({
    url: `${siteUrl}${route.path}`,
    lastModified,
    changeFrequency: "weekly",
    priority: route.priority,
  }));
}
