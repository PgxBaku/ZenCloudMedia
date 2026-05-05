import type { Metadata } from "next";
import Link from "next/link";
import PublicPageShell from "@/app/components/PublicPageShell";

const series = [
  {
    title: "World News",
    focus: "Conflict, policy, diplomacy, and global events explained without assuming the viewer has followed every update.",
    cadence: "Published when a story needs context, not just a headline.",
  },
  {
    title: "Oil Price Pulse",
    focus: "Short market explainers connecting crude prices, supply routes, geopolitics, shipping risk, and consumer pressure.",
    cadence: "Built as a repeatable market pulse format.",
  },
  {
    title: "Science and Space",
    focus: "Readable updates on research, astronomy, climate, technology, and discoveries that benefit from visual explanation.",
    cadence: "Selected for public interest and explainability.",
  },
  {
    title: "AI and Technology",
    focus: "Practical context around AI tools, automation, software systems, and the changing creator workflow.",
    cadence: "Focused on what changed and why it matters.",
  },
];

export const metadata: Metadata = {
  title: "Reels Archive | ZenCloudMedia",
  description:
    "ZenCloudMedia reel series archive with original context for world news, oil markets, science, space, AI, and short-form video experiments.",
};

export default function ReelsPage() {
  return (
    <PublicPageShell
      eyebrow="Reels archive"
      title="A public home for the recurring ZenCloudMedia reel series."
      intro="This archive explains what each series covers and how the short-form videos are produced. Platform feeds hold the clips; this site holds the context."
    >
      <section className="grid gap-4 md:grid-cols-2">
        {series.map((item) => (
          <article
            key={item.title}
            className="rounded-2xl border border-[#141414]/10 bg-white/55 p-5 dark:border-[#f0ece4]/10 dark:bg-white/5"
          >
            <h2 className="text-2xl font-semibold text-[#141414] dark:text-[#f0ece4]">
              {item.title}
            </h2>
            <p className="mt-3">{item.focus}</p>
            <p className="mt-4 text-sm font-semibold uppercase tracking-[0.12em] text-[#236b5d] dark:text-[#4eb89f]">
              {item.cadence}
            </p>
          </article>
        ))}
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-[#141414] dark:text-[#f0ece4]">
          Production notes
        </h2>
        <p className="mt-4">
          The videos are made from a repeatable production pipeline: research
          notes become a short script, the script becomes a Remotion scene
          sequence, and the finished reel is cut for vertical platforms. The
          pipeline helps keep typography, pacing, captions, and topic framing
          consistent across series.
        </p>
        <p className="mt-4">
          ZenCloudMedia publishes the finished videos on YouTube Shorts,
          Facebook Reels, and TikTok while keeping this website as the stable
          home for brand context, policies, contact paths, and future written
          explainers.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-[#141414] dark:text-[#f0ece4]">
          Watch the latest clips
        </h2>
        <div className="mt-5 flex flex-wrap gap-3">
          <a
            href="https://www.youtube.com/@ZenCloud1Media/shorts"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-[#141414] px-5 py-3 text-sm font-semibold text-[#f3efe6] dark:bg-[#f0ece4] dark:text-[#141414]"
          >
            YouTube Shorts
          </a>
          <a
            href="https://www.facebook.com/61573241866709"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-[#141414]/15 px-5 py-3 text-sm font-semibold dark:border-[#f0ece4]/20"
          >
            Facebook Reels
          </a>
          <a
            href="https://www.tiktok.com/@baku_retsu"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-[#141414]/15 px-5 py-3 text-sm font-semibold dark:border-[#f0ece4]/20"
          >
            TikTok
          </a>
          <Link
            href="/editorial-policy"
            className="rounded-full border border-[#141414]/15 px-5 py-3 text-sm font-semibold dark:border-[#f0ece4]/20"
          >
            Editorial policy
          </Link>
        </div>
      </section>
    </PublicPageShell>
  );
}
