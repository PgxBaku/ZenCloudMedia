import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f6f3ee] text-[#161616]">
      <section className="mx-auto grid min-h-screen w-full max-w-7xl grid-cols-1 gap-10 px-6 py-8 sm:px-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:py-10">
        <div className="flex min-h-[560px] flex-col justify-between">
          <nav className="flex items-center justify-between">
            <Link href="/" className="text-lg font-semibold tracking-wide">
              ZenCloudMedia
            </Link>
            <a
              href="mailto:hello@zencloudmedia.com"
              className="rounded-full border border-[#161616]/20 px-4 py-2 text-sm font-medium transition hover:border-[#161616]/50 hover:bg-white/70"
            >
              Start a Brief
            </a>
          </nav>

          <div className="max-w-2xl py-16">
            <p className="mb-5 text-sm font-semibold uppercase tracking-[0.18em] text-[#2c6a5c]">
              Calm growth systems for modern media teams
            </p>
            <h1 className="text-5xl font-semibold leading-[1.02] sm:text-6xl lg:text-7xl">
              Strategy, content, and cloud-native publishing that moves quietly
              fast.
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-[#4d4a45]">
              ZenCloudMedia helps founders and lean teams turn story, data, and
              automation into digital channels that are easier to run and easier
              to trust.
            </p>
          </div>

          <div className="grid gap-4 border-t border-[#161616]/15 pt-6 sm:grid-cols-3">
            {[
              ["01", "Brand systems"],
              ["02", "Content operations"],
              ["03", "Vercel-ready sites"],
            ].map(([number, label]) => (
              <div key={number}>
                <p className="text-sm font-semibold text-[#2c6a5c]">{number}</p>
                <p className="mt-1 text-base font-medium">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative min-h-[520px] overflow-hidden rounded-[2rem] bg-[#14231f] p-6 text-white shadow-2xl shadow-black/15">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(246,243,238,0.26),transparent_28%),radial-gradient(circle_at_88%_22%,rgba(45,123,106,0.42),transparent_25%),linear-gradient(140deg,#14231f_0%,#243c36_48%,#ede5d8_100%)]" />
          <div className="relative flex h-full min-h-[472px] flex-col justify-between">
            <div className="flex justify-between text-sm text-white/75">
              <span>Signal dashboard</span>
              <span>Live draft</span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-white/88 p-5 text-[#161616] shadow-xl backdrop-blur">
                <p className="text-sm font-medium text-[#2c6a5c]">
                  Publishing velocity
                </p>
                <p className="mt-5 text-5xl font-semibold">3.8x</p>
                <p className="mt-3 text-sm leading-6 text-[#4d4a45]">
                  Faster campaign-to-page handoff with reusable editorial
                  components.
                </p>
              </div>
              <div className="rounded-2xl border border-white/25 bg-white/12 p-5 backdrop-blur">
                <p className="text-sm font-medium text-white/70">
                  Core stack
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {["Next.js", "Vercel", "Analytics", "Automation"].map(
                    (item) => (
                      <span
                        key={item}
                        className="rounded-full bg-white/15 px-3 py-1 text-sm"
                      >
                        {item}
                      </span>
                    ),
                  )}
                </div>
              </div>
            </div>

            <p className="max-w-md text-3xl font-semibold leading-tight">
              Built for brands that need clear stories and dependable digital
              infrastructure.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
