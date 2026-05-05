import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import NavBar from "./NavBar";

const footerLinks = [
  { label: "About", href: "/about" },
  { label: "Reels", href: "/reels" },
  { label: "Editorial policy", href: "/editorial-policy" },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Contact", href: "/contact" },
];

export default function PublicPageShell({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  children: ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[#f3efe6] px-5 py-5 text-[#141414] dark:bg-[#111210] dark:text-[#f0ece4] sm:px-8 lg:px-10">
      <div className="hero-grid fixed inset-0" />
      <div className="relative mx-auto w-full max-w-5xl overflow-hidden rounded-[28px] border border-[#141414]/10 bg-[#fbf7ef]/92 shadow-2xl shadow-[#24170b]/10 backdrop-blur dark:border-[#f0ece4]/10 dark:bg-[#1c1a16]/92 dark:shadow-black/30">
        <NavBar />
        <article className="px-5 py-12 sm:px-10 lg:px-14">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-[#236b5d] dark:text-[#4eb89f]">
            {eyebrow}
          </p>
          <h1 className="max-w-4xl text-4xl font-semibold tracking-tight sm:text-5xl">
            {title}
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-[#5b534a] dark:text-[#b8b0a6]">
            {intro}
          </p>
          <div className="mt-10 space-y-10 text-base leading-8 text-[#4d463e] dark:text-[#d0c8bd]">
            {children}
          </div>
        </article>
        <footer className="border-t border-[#141414]/10 px-5 py-8 dark:border-[#f0ece4]/10 sm:px-10 lg:px-14">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <Link href="/" className="flex items-center gap-3">
              <span className="grid size-10 place-items-center overflow-hidden rounded-full bg-[#141414]">
                <Image
                  src="/zencloudmedia-logo.png"
                  alt=""
                  width={40}
                  height={40}
                  className="size-full object-cover"
                />
              </span>
              <span className="font-semibold">ZenCloudMedia</span>
            </Link>
            <nav className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-[#5b534a] dark:text-[#b8b0a6]">
              {footerLinks.map((link) => (
                <Link key={link.href} href={link.href} className="hover:underline">
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </footer>
      </div>
    </main>
  );
}
