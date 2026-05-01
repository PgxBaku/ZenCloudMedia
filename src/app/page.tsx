import Image from "next/image";
import { ArrowUpRight, Play, Radio, Sparkles } from "lucide-react";
import { FaFacebookF, FaTiktok, FaYoutube } from "react-icons/fa6";
import NavBar from "./components/NavBar";
import ReelCardsGrid from "./components/ReelCardsGrid";
import { contactEmail } from "@/app/lib/constants";
import { reelTracks } from "@/app/lib/reels";
import { fetchYouTubeVideos, findVideo } from "@/app/lib/fetchYouTubeVideos";

const socialLinks = [
  {
    name: "YouTube",
    label: "Watch the Shorts archive",
    href: "https://www.youtube.com/@ZenCloud1Media/shorts",
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
    accent: "bg-[#111111] dark:bg-[#3d3d3d]",
  },
];

const heroPhrases = [
  "Fast stories, clear reels, receipts included.",
  "Turning noisy headlines into clear vertical explainers.",
  "Short reels that make fast-moving stories easier to understand.",
  "AI-assisted reels for news, markets, science, and the weird edge of now.",
  "Receipts-first reels for a world moving too fast.",
  "Clear, sourced explainers built for the scroll.",
  "Newsroom pace, creator rhythm, software precision.",
  "Making sense of the scroll, one sourced reel at a time.",
  "Short-form video for stories that deserve more than a headline.",
  "Fast context for news, markets, science, and everything in motion.",
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

export default async function Home() {
  const youtubeVideos = await fetchYouTubeVideos();
  const resolvedTracks = reelTracks.map((track) => {
    if (track.source === "youtube") {
      const match = findVideo(youtubeVideos, track.titleKeyword);
      return {
        ...track,
        href: match?.url ?? "https://www.youtube.com/@ZenCloud1Media/shorts",
        image: match?.thumbnail || track.fallbackImage,
      };
    }
    return { ...track, href: track.videoUrl, image: track.image };
  });

  return (
    <main className="min-h-screen overflow-hidden bg-[#f3efe6] text-[#141414] dark:bg-[#111210] dark:text-[#f0ece4]">
      <section className="relative min-h-screen px-5 py-5 sm:px-8 lg:px-10">
        <div className="hero-grid absolute inset-0" />
        <div className="relative mx-auto flex min-h-[calc(100vh-40px)] w-full max-w-7xl flex-col rounded-[28px] border border-[#141414]/10 bg-[#fbf7ef]/88 shadow-2xl shadow-[#24170b]/10 backdrop-blur dark:border-[#f0ece4]/10 dark:bg-[#1c1a16]/88 dark:shadow-black/30">
          <NavBar />

          <div className="grid flex-1 gap-8 p-5 sm:p-7 lg:grid-cols-[1.02fr_0.98fr] lg:items-stretch">
            <div className="flex flex-col justify-between gap-12 py-0 lg:py-0">
              <div>
                <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#236b5d]/25 bg-[#e3f0ea] px-4 py-2 text-sm font-semibold uppercase tracking-[0.16em] text-[#236b5d] dark:border-[#4eb89f]/25 dark:bg-[#162420] dark:text-[#4eb89f]">
                  <Sparkles className="size-4" aria-hidden="true" />
                  Short-form news reels
                </p>
                <h1
                  aria-label="Fast stories, clear reels, receipts included."
                  className="hero-rotator max-w-4xl pl-7 pr-4 text-4xl font-medium italic leading-tight tracking-tight sm:pl-10 sm:text-6xl lg:text-7xl"
                >
                  {heroPhrases.map((phrase, index) => (
                    <span
                      key={phrase}
                      aria-hidden="true"
                      className="hero-phrase"
                      style={{ animationDelay: `${index * 3}s` }}
                    >
                      {phrase}
                    </span>
                  ))}
                </h1>
                <p className="mt-7 max-w-2xl text-lg leading-8 text-[#5b534a] dark:text-[#9e968c] sm:text-xl">
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
                    className="group flex min-h-28 flex-col justify-between rounded-2xl border border-[#141414]/10 bg-white/72 p-4 shadow-sm transition hover:-translate-y-1 hover:border-[#141414]/25 hover:bg-white dark:border-[#f0ece4]/10 dark:bg-[#2a2622] dark:hover:border-[#f0ece4]/25 dark:hover:bg-[#322e2a]"
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
                      <span className="mt-1 block text-sm leading-5 text-[#685f55] dark:text-[#9e968c]">
                        {label}
                      </span>
                    </span>
                  </a>
                ))}
              </div>

              <a
                href={`mailto:${contactEmail}`}
                className="group flex w-fit items-center gap-3 rounded-full border border-[#141414]/10 bg-[#141414] px-5 py-3 text-sm font-semibold text-[#f3efe6] transition hover:bg-[#2f3f3a] dark:border-[#f0ece4]/10 dark:bg-[#f0ece4] dark:text-[#141414] dark:hover:bg-[#d9d5cc]"
              >
                Contact: {contactEmail}
                <ArrowUpRight
                  className="size-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden="true"
                />
              </a>
            </div>

            <div
              id="reels"
              className="relative min-h-[620px] overflow-hidden rounded-[26px] bg-[#131817] p-5 text-white dark:bg-[#0d1210]"
            >
              <video
                autoPlay
                muted
                loop
                playsInline
                poster="/reels/world-conflict-smoke.jpg"
                aria-hidden="true"
                className="absolute inset-0 size-full object-cover opacity-40 motion-reduce:hidden"
              >
                <source src="/reels/hero-loop.mp4" type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(246,188,83,0.35),transparent_24%),radial-gradient(circle_at_82%_16%,rgba(65,151,133,0.4),transparent_25%),linear-gradient(145deg,rgba(19,24,23,0.88)_0%,rgba(32,51,47,0.82)_45%,rgba(228,208,173,0.45)_100%)]" />
              <div className="absolute inset-0 opacity-35 [background-image:linear-gradient(rgba(255,255,255,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:30px_30px]" />
              <div className="relative flex h-full min-h-[580px] flex-col justify-between">
                <div className="flex items-center justify-between text-sm text-white/70">
                  <span>Vertical reel system</span>
                  <span>9:16 / sourced / captioned</span>
                </div>

                <ReelCardsGrid tracks={resolvedTracks} />

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

      <section id="about" className="px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
            <div>
              <p className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-[#236b5d] dark:text-[#4eb89f]">
                <Radio className="size-4" aria-hidden="true" />
                What the brand is about
              </p>
              <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                Clear reels for noisy topics.
              </h2>
            </div>
            <p className="max-w-3xl text-lg leading-8 text-[#5b534a] dark:text-[#9e968c]">
              ZenCloudMedia turns fast-moving material into short explainers
              that respect the viewer: direct framing, readable visuals, source
              awareness, and a repeatable motion identity across every channel.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {principles.map((item) => (
              <article
                key={item.title}
                className="rounded-3xl border border-[#141414]/10 bg-[#fffaf1] p-6 shadow-sm dark:border-[#f0ece4]/10 dark:bg-[#191612]"
              >
                <h3 className="text-2xl font-semibold">{item.title}</h3>
                <p className="mt-4 text-base leading-7 text-[#62594f] dark:text-[#9e968c]">
                  {item.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer className="px-5 pb-12 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl border-t border-[#141414]/10 pt-12 dark:border-[#f0ece4]/10">
          <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <span className="grid size-9 place-items-center overflow-hidden rounded-full bg-[#141414]">
                  <Image
                    src="/zencloudmedia-logo.png"
                    alt=""
                    width={36}
                    height={36}
                    className="size-full object-cover"
                  />
                </span>
                <span className="font-semibold">ZenCloudMedia</span>
              </div>
              <p className="mt-3 max-w-xs text-sm leading-6 text-[#5b534a] dark:text-[#9e968c]">
                AI-assisted short-form reels for news, markets, science, and
                everything in motion.
              </p>
            </div>

            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-[#5b534a] dark:text-[#9e968c]">
                Find me on
              </p>
              <div className="flex gap-3">
                {socialLinks.map(({ name, href, Icon, accent }) => (
                  <a
                    key={name}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={name}
                    className={`grid size-9 place-items-center rounded-full text-white transition hover:opacity-80 ${accent}`}
                  >
                    <Icon className="size-4" aria-hidden="true" />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-[#5b534a] dark:text-[#9e968c]">
                Contact
              </p>
              <a
                href={`mailto:${contactEmail}`}
                className="text-sm font-medium text-[#141414] transition hover:text-[#236b5d] dark:text-[#f0ece4] dark:hover:text-[#4eb89f]"
              >
                {contactEmail}
              </a>
            </div>
          </div>

          <p className="mt-12 text-sm text-[#5b534a] dark:text-[#9e968c]">
            © {new Date().getFullYear()} ZenCloudMedia. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
