import { buildResumeText } from '../../../resume/data/machine-readable'

export function GET() {
  return new Response(buildResumeText(), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  })
}
