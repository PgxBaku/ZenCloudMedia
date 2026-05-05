import type { Metadata } from "next";
import PublicPageShell from "@/app/components/PublicPageShell";
import { contactEmail } from "@/app/lib/constants";

export const metadata: Metadata = {
  title: "Contact | ZenCloudMedia",
  description:
    "Contact ZenCloudMedia for corrections, collaboration, rights questions, and short-form video inquiries.",
};

export default function ContactPage() {
  return (
    <PublicPageShell
      eyebrow="Contact"
      title="Reach ZenCloudMedia for corrections, collaboration, or rights questions."
      intro="Use this page for publication questions, source notes, corrections, and partnership inquiries."
    >
      <section>
        <h2 className="text-2xl font-semibold text-[#141414] dark:text-[#f0ece4]">
          Email
        </h2>
        <p className="mt-4">
          The primary contact address is{" "}
          <a className="font-semibold underline" href={`mailto:${contactEmail}`}>
            {contactEmail}
          </a>
          .
        </p>
        <p className="mt-4">
          For corrections, include the page or platform URL, the specific claim
          or timestamp, and a source that supports the correction. For rights or
          takedown questions, include the asset, owner, and preferred resolution.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-[#141414] dark:text-[#f0ece4]">
          Social channels
        </h2>
        <p className="mt-4">
          ZenCloudMedia publishes short clips on YouTube Shorts, Facebook Reels,
          and TikTok. Email remains the best contact path for anything that
          needs a reliable response.
        </p>
      </section>
    </PublicPageShell>
  );
}
