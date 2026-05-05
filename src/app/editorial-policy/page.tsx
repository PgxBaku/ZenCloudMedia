import type { Metadata } from "next";
import PublicPageShell from "@/app/components/PublicPageShell";
import { contactEmail } from "@/app/lib/constants";

export const metadata: Metadata = {
  title: "Editorial Policy | ZenCloudMedia",
  description:
    "ZenCloudMedia editorial standards for sourcing, AI assistance, corrections, and short-form explainer production.",
};

export default function EditorialPolicyPage() {
  return (
    <PublicPageShell
      eyebrow="Editorial standards"
      title="How ZenCloudMedia selects, researches, and publishes short-form stories."
      intro="This policy explains the standards behind the reels and written context published on ZenCloudMedia."
    >
      <section>
        <h2 className="text-2xl font-semibold text-[#141414] dark:text-[#f0ece4]">
          Topic selection
        </h2>
        <p className="mt-4">
          ZenCloudMedia prioritizes stories where a short explainer can add
          practical context: fast-moving news, science developments, technology
          shifts, market pressure, and visual topics that benefit from motion
          design. Topics are selected for clarity and relevance rather than
          outrage or clickbait.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-[#141414] dark:text-[#f0ece4]">
          Sourcing and verification
        </h2>
        <p className="mt-4">
          Scripts are built from public reporting, official releases, data
          sources, and primary documents when available. The production process
          favors claims that can be traced to a source and avoids presenting
          speculation as fact. When a story is still developing, the reel should
          make that uncertainty visible.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-[#141414] dark:text-[#f0ece4]">
          AI-assisted production
        </h2>
        <p className="mt-4">
          AI tools may help with research organization, script drafts, captions,
          visual prompts, and production automation. They do not replace final
          editorial review. Human review is used for topic framing, accuracy
          checks, style decisions, and publication choices.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-[#141414] dark:text-[#f0ece4]">
          Corrections
        </h2>
        <p className="mt-4">
          If a published item contains an error, send a clear note with the URL,
          timestamp if applicable, and supporting source to{" "}
          <a className="font-semibold underline" href={`mailto:${contactEmail}`}>
            {contactEmail}
          </a>
          . Corrections may be handled by updating the written page, replacing a
          reel, adding a clarification, or removing an item when the issue is
          material.
        </p>
      </section>
    </PublicPageShell>
  );
}
