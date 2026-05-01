import { FaFacebookF, FaTiktok, FaYoutube } from "react-icons/fa6";
import type { IconType } from "react-icons";

type BaseTrack = {
  title: string;
  tag: string;
  PlatformIcon: IconType;
  platformClass: string;
};

export type ResolvedTrack = {
  title: string;
  tag: string;
  PlatformIcon: IconType;
  platformClass: string;
  href: string;
  image: string;
};

export type ReelTrack =
  | (BaseTrack & { source: "youtube"; titleKeyword: string; fallbackImage: string })
  | (BaseTrack & { source: "manual"; videoUrl: string; image: string });

export const reelTracks: ReelTrack[] = [
  {
    title: "Trump News",
    tag: "Politics",
    source: "youtube",
    titleKeyword: "Trump",
    fallbackImage: "/reels/world-conflict-smoke.jpg",
    PlatformIcon: FaYoutube,
    platformClass: "bg-[#ff0033] text-white",
  },
  {
    title: "Science",
    tag: "Science",
    source: "youtube",
    titleKeyword: "Science",
    fallbackImage: "/reels/world-night-police.jpg",
    PlatformIcon: FaYoutube,
    platformClass: "bg-[#ff0033] text-white",
  },
  {
    title: "AI",
    tag: "Technology",
    source: "youtube",
    titleKeyword: "AI",
    fallbackImage: "/reels/oil-price-pulse-cover.jpeg",
    PlatformIcon: FaYoutube,
    platformClass: "bg-[#ff0033] text-white",
  },
  {
    title: "Gaming",
    tag: "Gaming",
    source: "youtube",
    titleKeyword: "Gaming",
    fallbackImage: "/reels/oil-price-pulse-pressures.jpeg",
    PlatformIcon: FaYoutube,
    platformClass: "bg-[#ff0033] text-white",
  },
  {
    title: "World News",
    tag: "World",
    source: "youtube",
    titleKeyword: "World",
    fallbackImage: "/reels/news-harbor-smoke.jpg",
    PlatformIcon: FaYoutube,
    platformClass: "bg-[#ff0033] text-white",
  },
  {
    title: "Oil Price Pulse",
    tag: "Markets",
    source: "manual",
    videoUrl: "https://www.youtube.com/@ZenCloud1Media/shorts",
    image: "/reels/oil-price-pulse-cover.jpeg",
    PlatformIcon: FaYoutube,
    platformClass: "bg-[#ff0033] text-white",
  },
];
