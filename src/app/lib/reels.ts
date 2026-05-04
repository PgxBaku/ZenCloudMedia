type BaseTrack = {
  title: string;
  tag: string;
  platform: "youtube" | "tiktok" | "facebook";
  platformClass: string;
};

export type ResolvedTrack = {
  title: string;
  tag: string;
  platform: "youtube" | "tiktok" | "facebook";
  platformClass: string;
  href: string;
  image: string;
};

export type ReelTrack =
  | (BaseTrack & { source: "youtube"; titleKeyword: string; fallbackImage: string })
  | (BaseTrack & { source: "tiktok"; fallbackImage: string })
  | (BaseTrack & { source: "manual"; videoUrl: string; image: string });

export const reelTracks: ReelTrack[] = [
  {
    title: "Trump News",
    tag: "Politics",
    source: "youtube",
    titleKeyword: "Trump",
    fallbackImage: "/reels/world-conflict-smoke.jpg",
    platform: "youtube",
    platformClass: "bg-[#ff0033] text-white",
  },
  {
    title: "Science",
    tag: "Science",
    source: "youtube",
    titleKeyword: "Science",
    fallbackImage: "/reels/world-night-police.jpg",
    platform: "youtube",
    platformClass: "bg-[#ff0033] text-white",
  },
  {
    title: "AI",
    tag: "Technology",
    source: "youtube",
    titleKeyword: "AI",
    fallbackImage: "/reels/oil-price-pulse-cover.jpeg",
    platform: "youtube",
    platformClass: "bg-[#ff0033] text-white",
  },
  {
    title: "Gaming",
    tag: "Gaming",
    source: "manual",
    videoUrl: "https://www.facebook.com/61573241866709",
    image: "/reels/oil-price-pulse-pressures.jpeg",
    platform: "facebook",
    platformClass: "bg-[#1877f2] text-white",
  },
  {
    title: "World News",
    tag: "World",
    source: "youtube",
    titleKeyword: "World",
    fallbackImage: "/reels/news-harbor-smoke.jpg",
    platform: "youtube",
    platformClass: "bg-[#ff0033] text-white",
  },
  {
    title: "Oil Price Pulse",
    tag: "Markets",
    source: "tiktok",
    fallbackImage: "/reels/oil-price-pulse-cover.jpeg",
    platform: "tiktok",
    platformClass: "bg-[#111111] text-white",
  },
];
