const TIKTOK_RSS =
  "https://raw.githubusercontent.com/PgxBaku/tiktok-rss-flat/main/rss/baku_retsu.xml";

export type TikTokEntry = {
  title: string;
  url: string;
  thumbnail: string;
  pubDate: Date;
};

export async function fetchTikTokVideos(): Promise<TikTokEntry[]> {
  try {
    const fetchOpts =
      process.env.NODE_ENV === "development"
        ? { cache: "no-store" as const }
        : { next: { revalidate: 300 } };
    const res = await fetch(TIKTOK_RSS, fetchOpts);
    if (!res.ok) return [];
    const xml = await res.text();

    const entries: TikTokEntry[] = [];
    const blocks = xml.split("<item>").slice(1);

    for (const block of blocks) {
      const titleMatch = block.match(/<title>([^<]+)<\/title>/);
      const linkMatch = block.match(/<link>([^<]+)<\/link>/);
      const thumbMatch = block.match(/<img src="([^"]+)"/);
      const dateMatch = block.match(/<pubDate>([^<]+)<\/pubDate>/);

      if (titleMatch && linkMatch) {
        entries.push({
          title: titleMatch[1],
          url: linkMatch[1],
          thumbnail: thumbMatch?.[1] ?? "",
          pubDate: dateMatch ? new Date(dateMatch[1]) : new Date(0),
        });
      }
    }

    return entries.sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());
  } catch {
    return [];
  }
}
