const CHANNEL_RSS =
  "https://www.youtube.com/feeds/videos.xml?channel_id=UCLRh6px-vaZhFrcpehyt6zQ";

export type YouTubeEntry = {
  title: string;
  url: string;
  thumbnail: string;
};

export async function fetchYouTubeVideos(): Promise<YouTubeEntry[]> {
  try {
    const fetchOpts =
      process.env.NODE_ENV === "development"
        ? { cache: "no-store" as const }
        : { next: { revalidate: 300 } };
    const res = await fetch(CHANNEL_RSS, fetchOpts);
    if (!res.ok) return [];
    const xml = await res.text();

    const entries: YouTubeEntry[] = [];
    const blocks = xml.split("<entry>").slice(1);

    for (const block of blocks) {
      const titleMatch = block.match(/<title>([^<]+)<\/title>/);
      const urlMatch = block.match(
        /<link rel="alternate"[^>]*href="(https:\/\/www\.youtube\.com\/shorts\/[^"]+)"/
      );
      const thumbMatch = block.match(/<media:thumbnail url="([^"]+)"/);

      if (titleMatch && urlMatch) {
        entries.push({
          title: titleMatch[1],
          url: urlMatch[1],
          thumbnail: thumbMatch?.[1] ?? "",
        });
      }
    }

    return entries;
  } catch {
    return [];
  }
}

export function findVideo(
  entries: YouTubeEntry[],
  keyword: string
): YouTubeEntry | undefined {
  const lower = keyword.toLowerCase();
  return entries.find((e) => e.title.toLowerCase().includes(lower));
}
