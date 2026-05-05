import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = "https://zencloudmedia.vercel.app";
  const lastModified = new Date("2026-05-05");
  const routes = [
    { path: "", priority: 1 },
    { path: "/about", priority: 0.85 },
    { path: "/reels", priority: 0.9 },
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
