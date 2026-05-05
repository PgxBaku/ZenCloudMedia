import type { Metadata } from "next";
import PublicPageShell from "@/app/components/PublicPageShell";
import { contactEmail } from "@/app/lib/constants";

export const metadata: Metadata = {
  title: "Privacy Policy | ZenCloudMedia",
  description:
    "ZenCloudMedia privacy policy covering analytics, advertising, cookies, contact email, and third-party platforms.",
};

export default function PrivacyPage() {
  return (
    <PublicPageShell
      eyebrow="Privacy policy"
      title="How ZenCloudMedia handles visitors, cookies, advertising, and contact email."
      intro="This policy describes the information that may be collected when you visit ZenCloudMedia or contact the site owner."
    >
      <section>
        <h2 className="text-2xl font-semibold text-[#141414] dark:text-[#f0ece4]">
          Information collected
        </h2>
        <p className="mt-4">
          ZenCloudMedia does not ask visitors to create an account for the public
          site. If you send an email, the information you choose to include is
          used to respond to that message. Basic technical information may be
          processed by hosting, analytics, security, and performance providers
          so the site can load, be measured, and be protected.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-[#141414] dark:text-[#f0ece4]">
          Cookies and advertising
        </h2>
        <p className="mt-4">
          The site may use cookies or similar technologies from service
          providers. If Google AdSense is enabled, Google and its partners may
          use cookies to serve ads based on a visitor&apos;s prior visits to this site
          or other websites. Visitors can learn more about Google advertising
          cookies and manage ad personalization through Google&apos;s advertising
          settings.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-[#141414] dark:text-[#f0ece4]">
          Third-party links
        </h2>
        <p className="mt-4">
          ZenCloudMedia links to YouTube, Facebook, TikTok, and other external
          platforms where videos may be published. Those platforms have their
          own privacy practices and terms. Visiting those links is subject to
          the policies of the external service.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-[#141414] dark:text-[#f0ece4]">
          Contact
        </h2>
        <p className="mt-4">
          Privacy questions can be sent to{" "}
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
