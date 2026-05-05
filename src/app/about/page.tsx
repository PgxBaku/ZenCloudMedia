import type { Metadata } from "next";
import PublicPageShell from "@/app/components/PublicPageShell";
import { contactEmail } from "@/app/lib/constants";

export const metadata: Metadata = {
  title: "About | ZenCloudMedia",
  description:
    "About ZenCloudMedia, an independent short-form news and explainers studio built around original research, Remotion, and AI-assisted production.",
};

export default function AboutPage() {
  return (
    <PublicPageShell
      eyebrow="About the studio"
      title="Independent short-form explainers with source-first discipline."
      intro="ZenCloudMedia is the publishing home for short-form video projects that turn fast-moving stories into clearer, more useful context."
    >
      <section>
        <h2 className="text-2xl font-semibold text-[#141414] dark:text-[#f0ece4]">
          What ZenCloudMedia publishes
        </h2>
        <p className="mt-4">
          The site focuses on news, markets, science, technology, space, and
          culture stories that benefit from quick context. The goal is not to
          chase every headline. The goal is to make a selected story easier to
          understand through a short script, readable motion design, and a clear
          explanation of why the story matters.
        </p>
        <p className="mt-4">
          Each reel starts with a research pass before it becomes video. The
          production system uses Remotion, TypeScript, Python, and AI-assisted
          drafting tools, but the editorial direction stays human-led: topic
          selection, framing, final judgment, and publication decisions are made
          by the site owner.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-[#141414] dark:text-[#f0ece4]">
          Why this site exists
        </h2>
        <p className="mt-4">
          Social platforms are useful for distribution, but they are not enough
          as a permanent home. ZenCloudMedia keeps the archive, editorial
          standards, contact information, and publishing context in one place so
          viewers can understand the work behind the reels instead of only
          seeing the final clip in a feed.
        </p>
        <p className="mt-4">
          The long-term aim is a reliable public hub for recurring series such
          as world news explainers, science updates, oil and market pulse clips,
          AI coverage, and motion-lab experiments.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-[#141414] dark:text-[#f0ece4]">
          Contact
        </h2>
        <p className="mt-4">
          Questions, corrections, collaboration notes, and rights concerns can
          be sent to{" "}
          <a className="font-semibold underline" href={`mailto:${contactEmail}`}>
            {contactEmail}
          </a>
          .
        </p>
      </section>
    </PublicPageShell>
  );
}
