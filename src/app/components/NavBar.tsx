"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";

const contactEmail = "zen1cloud1@gmail.com";

const navLinks = [
  { label: "Reels", href: "#reels" },
  { label: "Socials", href: "#socials" },
  { label: "About", href: "#about" },
];

export default function NavBar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="border-b border-[#141414]/10">
      <div className="flex items-center justify-between px-5 py-4 sm:px-7">
        <Link href="/" className="flex items-center gap-4">
          <span className="grid size-16 place-items-center overflow-hidden rounded-full border border-[#141414]/10 bg-[#141414] shadow-md sm:size-20">
            <Image
              src="/zencloudmedia-logo.png"
              alt="ZenCloudMedia logo"
              width={80}
              height={80}
              priority
              className="size-full object-cover"
            />
          </span>
          <span className="text-lg font-semibold tracking-tight">
            ZenCloudMedia
          </span>
        </Link>

        <div className="hidden items-center gap-6 text-sm font-medium text-[#4d463e] sm:flex">
          {navLinks.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="transition hover:text-[#141414]"
            >
              {label}
            </a>
          ))}
          <a
            href={`mailto:${contactEmail}`}
            className="rounded-full bg-[#141414] px-4 py-2 text-[#f3efe6] transition hover:bg-[#2f3f3a]"
          >
            Contact
          </a>
        </div>

        <button
          className="grid size-10 place-items-center rounded-full border border-[#141414]/10 transition hover:bg-[#141414]/5 sm:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? (
            <X className="size-5" aria-hidden="true" />
          ) : (
            <Menu className="size-5" aria-hidden="true" />
          )}
        </button>
      </div>

      {open && (
        <div className="flex flex-col gap-1 border-t border-[#141414]/10 p-4 sm:hidden">
          {navLinks.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              onClick={() => setOpen(false)}
              className="rounded-xl px-4 py-3 text-sm font-medium text-[#4d463e] transition hover:bg-[#141414]/5 hover:text-[#141414]"
            >
              {label}
            </a>
          ))}
          <a
            href={`mailto:${contactEmail}`}
            className="mt-2 rounded-full bg-[#141414] px-4 py-3 text-center text-sm font-semibold text-[#f3efe6] transition hover:bg-[#2f3f3a]"
          >
            Contact
          </a>
        </div>
      )}
    </nav>
  );
}
