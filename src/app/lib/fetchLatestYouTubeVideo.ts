const CHANNEL_RSS =
  "https://www.youtube.com/feeds/videos.xml?channel_id=UCLRh6px-vaZhFrcpehyt6zQ";
const FALLBACK = "https://www.youtube.com/@ZenCloud1Media/shorts";

export async function fetchLatestYouTubeVideo(): Promise<string> {
  try {
    const res = await fetch(CHANNEL_RSS, { next: { revalidate: 3600 } });
    if (!res.ok) return FALLBACK;
    const xml = await res.text();
    const match = xml.match(
      /<link rel="alternate"[^>]*href="(https:\/\/www\.youtube\.com\/shorts\/[^"]+)"/
    );
    return match?.[1] ?? FALLBACK;
  } catch {
    return FALLBACK;
  }
}
