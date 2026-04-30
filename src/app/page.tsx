import Link from "next/link";
import { ArrowUpRight, Play, Radio, Sparkles, Waves } from "lucide-react";
import { FaFacebookF, FaTiktok, FaYoutube } from "react-icons/fa6";

const socialLinks = [
  {
    name: "YouTube",
    label: "Watch the Shorts archive",
    href: "https://www.youtube.com/channel/UCLRh6px-vaZhFrcpehyt6zQ",
    Icon: FaYoutube,
    accent: "bg-[#ff0033]",
  },
  {
    name: "Facebook",
    label: "Follow the Reels feed",
    href: "https://www.facebook.com/61573241866709",
    Icon: FaFacebookF,
    accent: "bg-[#1877f2]",
  },
  {
    name: "TikTok",
    label: "Catch the vertical cuts",
    href: "https://www.tiktok.com/@baku_retsu",
    Icon: FaTiktok,
    accent: "bg-[#111111]",
  },
];

const reelTracks = [
  "AI News",
  "Science",
  "Space",
  "World",
  "Trump News",
  "Oil Price Pulse",
];

const principles = [
  {
    title: "Sourced first",
    body: "Each reel starts with a tight research pass, visible source trails, and a bias toward verifiable context.",
  },
  {
    title: "Built in motion",
    body: "Remotion turns every story into repeatable, branded video systems instead of one-off edits.",
  },
  {
    title: "Made for the scroll",
    body: "Vertical pacing, readable frames, punchy narration, and platform-ready captions shape the final cut.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f3efe6] text-[#141414]">
      <section className="relative min-h-screen px-5 py-5 sm:px-8 lg:px-10">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(20,20,20,0.055)_1px,transparent_1px),linear-gradient(180deg,rgba(20,20,20,0.045)_1px,transparent_1px)] bg-[size:44px_44px]" />
        <div className="relative mx-auto flex min-h-[calc(100vh-40px)] w-full max-w-7xl flex-col rounded-[28px] border border-[#141414]/10 bg-[#fbf7ef]/88 shadow-2xl shadow-[#24170b]/10 backdrop-blur">
          <nav className="flex items-center justify-between border-b border-[#141414]/10 px-5 py-4 sm:px-7">
            <Link href="/" className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-full bg-[#141414] text-[#f3efe6]">
                <Waves className="size-5" aria-hidden="true" />
              </span>
              <span className="text-lg font-semibold tracking-tight">
                ZenCloudMedia
              </span>
            </Link>
            <div className="hidden items-center gap-6 text-sm font-medium text-[#4d463e] sm:flex">
              <a href="#reels" className="transition hover:text-[#141414]">
                Reels
              </a>
              <a href="#socials" className="transition hover:text-[#141414]">
                Socials
              </a>
              <a href="#process" className="transition hover:text-[#141414]">
                Process
              </a>
            </div>
          </nav>

          <div className="grid flex-1 gap-8 p-5 sm:p-7 lg:grid-cols-[1.02fr_0.98fr] lg:items-stretch">
            <div className="flex flex-col justify-between gap-12 py-8 lg:py-12">
              <div>
                <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#236b5d]/25 bg-[#e3f0ea] px-4 py-2 text-sm font-semibold uppercase tracking-[0.16em] text-[#236b5d]">
                  <Sparkles className="size-4" aria-hidden="true" />
                  Remotion-powered reels
                </p>
                <h1 className="max-w-4xl text-5xl font-semibold leading-[0.97] tracking-tight sm:text-7xl lg:text-8xl">
                  Short-form explainers with receipts, rhythm, and a point of
                  view.
                </h1>
                <p className="mt-7 max-w-2xl text-lg leading-8 text-[#5b534a] sm:text-xl">
                  ZenCloudMedia is my publishing studio for AI-assisted news
                  reels, market explainers, science updates, and motion-lab
                  experiments built from a Remotion video pipeline.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3" id="socials">
                {socialLinks.map(({ name, label, href, Icon, accent }) => (
                  <a
                    key={name}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex min-h-28 flex-col justify-between rounded-2xl border border-[#141414]/10 bg-white/72 p-4 shadow-sm transition hover:-translate-y-1 hover:border-[#141414]/25 hover:bg-white"
                  >
                    <span
                      className={`grid size-11 place-items-center rounded-full text-white ${accent}`}
                    >
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <span>
                      <span className="flex items-center justify-between text-base font-semibold">
                        {name}
                        <ArrowUpRight
                          className="size-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                          aria-hidden="true"
                        />
                      </span>
                      <span className="mt-1 block text-sm leading-5 text-[#685f55]">
                        {label}
                      </span>
                    </span>
                  </a>
                ))}
              </div>
            </div>

            <div className="relative min-h-[620px] overflow-hidden rounded-[26px] bg-[#131817] p-5 text-white">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(246,188,83,0.35),transparent_24%),radial-gradient(circle_at_82%_16%,rgba(65,151,133,0.4),transparent_25%),linear-gradient(145deg,#131817_0%,#20332f_45%,#e4d0ad_100%)]" />
              <div className="absolute inset-0 opacity-35 [background-image:linear-gradient(rgba(255,255,255,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:30px_30px]" />
              <div className="relative flex h-full min-h-[580px] flex-col justify-between">
                <div className="flex items-center justify-between text-sm text-white/70">
                  <span>Vertical reel system</span>
                  <span>9:16 / sourced / captioned</span>
                </div>

                <div className="mx-auto grid w-full max-w-md grid-cols-3 gap-3">
                  {reelTracks.map((track, index) => (
                    <div
                      key={track}
                      className={`relative aspect-[9/16] overflow-hidden rounded-[20px] border border-white/20 bg-white/10 p-3 shadow-2xl backdrop-blur ${
                        index % 2 === 0 ? "translate-y-8" : ""
                      }`}
                    >
                      <div className="absolute inset-0 bg-[linear-gradient(160deg,rgba(255,255,255,0.28),transparent_42%),radial-gradient(circle_at_50%_30%,rgba(247,193,94,0.5),transparent_28%)]" />
                      <div className="relative flex h-full flex-col justify-between">
                        <span className="w-fit rounded-full bg-black/30 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em]">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className="text-sm font-semibold leading-tight">
                          {track}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid gap-4 rounded-3xl border border-white/20 bg-black/28 p-5 backdrop-blur-md sm:grid-cols-[auto_1fr]">
                  <span className="grid size-14 place-items-center rounded-full bg-[#f6bc53] text-[#141414]">
                    <Play className="size-7 fill-current" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-2xl font-semibold leading-tight">
                      A living archive for the reels I publish across the web.
                    </p>
                    <p className="mt-3 text-sm leading-6 text-white/68">
                      Newsroom energy, creator speed, and software-driven
                      consistency in one public home.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="reels" className="px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
            <div>
              <p className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-[#236b5d]">
                <Radio className="size-4" aria-hidden="true" />
                What the brand is about
              </p>
              <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                Clear reels for noisy topics.
              </h2>
            </div>
            <p className="max-w-3xl text-lg leading-8 text-[#5b534a]">
              ZenCloudMedia turns fast-moving material into short explainers
              that respect the viewer: direct framing, readable visuals, source
              awareness, and a repeatable motion identity across every channel.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3" id="process">
            {principles.map((item) => (
              <article
                key={item.title}
                className="rounded-3xl border border-[#141414]/10 bg-[#fffaf1] p-6 shadow-sm"
              >
                <h3 className="text-2xl font-semibold">{item.title}</h3>
                <p className="mt-4 text-base leading-7 text-[#62594f]">
                  {item.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
