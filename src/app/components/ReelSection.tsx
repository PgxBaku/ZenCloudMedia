import { Play } from 'lucide-react'
import ReelCardsGrid from './ReelCardsGrid'
import { reelTracks } from '@/app/lib/reels'
import { fetchYouTubeVideos } from '@/app/lib/fetchYouTubeVideos'
import { fetchTikTokVideos } from '@/app/lib/fetchTikTokVideos'

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default async function ReelSection() {
  const [youtubeVideos, tiktokVideos] = await Promise.all([
    fetchYouTubeVideos(),
    fetchTikTokVideos(),
  ])

  const withIndex = reelTracks.map((track) => {
    if (track.source === 'youtube') {
      const lower = track.titleKeyword.toLowerCase()
      const matchIndex = youtubeVideos.findIndex((e) =>
        e.title.toLowerCase().includes(lower),
      )
      const match = matchIndex >= 0 ? youtubeVideos[matchIndex] : undefined
      return {
        ...track,
        href: match?.url ?? 'https://www.youtube.com/@ZenCloud1Media/shorts',
        image: match?.thumbnail || track.fallbackImage,
        matchIndex,
      }
    }
    if (track.source === 'tiktok') {
      const latest = tiktokVideos[0]
      return {
        ...track,
        href: latest?.url ?? 'https://www.tiktok.com/@baku_retsu',
        image: latest?.thumbnail || track.fallbackImage,
        matchIndex: latest ? 0 : -1,
      }
    }
    return { ...track, href: track.videoUrl, image: track.image, matchIndex: -1 }
  })

  const matched = [...withIndex.filter((t) => t.matchIndex >= 0)].sort(
    (a, b) => a.matchIndex - b.matchIndex,
  )
  const unmatched = shuffle(withIndex.filter((t) => t.matchIndex === -1))
  const resolvedTracks = [...matched, ...unmatched]

  return (
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
            Newsroom energy, creator speed, and software-driven consistency in
            one public home.
          </p>
        </div>
      </div>
    </div>
  )
}
