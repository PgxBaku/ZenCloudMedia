import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 — Page Not Found | ZenCloudMedia",
};

export default function NotFound() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f3efe6] text-[#141414] dark:bg-[#111210] dark:text-[#f0ece4]">
      <div className="relative flex min-h-screen items-center justify-center px-5 py-10">
        <div className="hero-grid absolute inset-0" />
        <div className="relative mx-auto flex w-full max-w-lg flex-col items-center rounded-[28px] border border-[#141414]/10 bg-[#fbf7ef]/88 px-8 py-14 text-center shadow-2xl shadow-[#24170b]/10 backdrop-blur dark:border-[#f0ece4]/10 dark:bg-[#1c1a16]/88 dark:shadow-black/30">
          <Link
            href="/"
            className="mb-8 grid size-16 place-items-center overflow-hidden rounded-full border border-[#141414]/10 bg-[#141414] shadow-md dark:border-[#f0ece4]/10 sm:size-20"
          >
            <Image
              src="/zencloudmedia-logo.png"
              alt="ZenCloudMedia"
              width={80}
              height={80}
              className="size-full object-cover"
            />
          </Link>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-[#236b5d] dark:text-[#4eb89f]">
            404
          </p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Page not found.
          </h1>
          <p className="mt-4 text-base leading-7 text-[#5b534a] dark:text-[#9e968c]">
            This URL doesn&apos;t exist. The reel you&apos;re looking for may
            have moved or never existed.
          </p>
          <Link
            href="/"
            className="group mt-8 flex items-center gap-2 rounded-full bg-[#141414] px-6 py-3 text-sm font-semibold text-[#f3efe6] transition hover:bg-[#2f3f3a] dark:bg-[#f0ece4] dark:text-[#141414] dark:hover:bg-[#d9d5cc]"
          >
            Back to home
            <ArrowUpRight
              className="size-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>
    </main>
  );
}
