import type { Metadata } from "next";
import PublicPageShell from "@/app/components/PublicPageShell";
import { contactEmail } from "@/app/lib/constants";

export const metadata: Metadata = {
  title: "Terms of Use | ZenCloudMedia",
  description:
    "ZenCloudMedia terms of use for public site content, external links, corrections, and rights questions.",
};

export default function TermsPage() {
  return (
    <PublicPageShell
      eyebrow="Terms of use"
      title="Terms for using the ZenCloudMedia website and public content."
      intro="These terms cover the public website, written context, links, and short-form media references published by ZenCloudMedia."
    >
      <section>
        <h2 className="text-2xl font-semibold text-[#141414] dark:text-[#f0ece4]">
          Use of the site
        </h2>
        <p className="mt-4">
          ZenCloudMedia is provided for informational and creative publishing
          purposes. You may browse the site, read public pages, and follow links
          to external video platforms. You may not attempt to disrupt the site,
          access private administrative areas, or misuse contact paths.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-[#141414] dark:text-[#f0ece4]">
          Content and accuracy
        </h2>
        <p className="mt-4">
          The site publishes short-form explainers and related written context.
          Content may summarize developing events and should not be treated as
          legal, financial, medical, or professional advice. Corrections are
          welcomed through the contact address.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-[#141414] dark:text-[#f0ece4]">
          External platforms
        </h2>
        <p className="mt-4">
          Links to YouTube, Facebook, TikTok, and other external services are
          provided for convenience. ZenCloudMedia does not control those
          platforms and is not responsible for their availability, policies, or
          user experience.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-[#141414] dark:text-[#f0ece4]">
          Rights and contact
        </h2>
        <p className="mt-4">
          For rights questions, corrections, or other concerns, email{" "}
          <a className="font-semibold underline" href={`mailto:${contactEmail}`}>
            {contactEmail}
          </a>
          .
        </p>
        <p className="mt-4 text-sm text-[#5b534a] dark:text-[#b8b0a6]">
          Last updated: May 5, 2026.
        </p>
      </section>
    </PublicPageShell>
  );
}
