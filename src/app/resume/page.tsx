import type { Metadata } from 'next'
import ResumeClient from './ResumeClient'

export const metadata: Metadata = {
  title: 'Resume — Paul P. Xiong | ZenCloudMedia',
  description:
    'Enterprise integration architect + hands-on AI builder. 10+ years in .NET, MuleSoft, Python, Next.js, and AI/Copilot. Led 100+ integrations, $2M budget, 10+ engineers at ConvergeOne.',
  openGraph: {
    title: 'Resume — Paul P. Xiong | Engineering Manager',
    description:
      'Enterprise architect bridging legacy integration with modern AI — .NET, MuleSoft, Python, Next.js. Sr Engineer → Solutions Architect → Dev Manager → AI founder.',
    images: ['/zencloudmedia-logo.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Resume — Paul P. Xiong',
    description:
      'Engineering Manager with deep AI capability. Interactive career timeline.',
    images: ['/zencloudmedia-logo.png'],
  },
}

export default function ResumePage() {
  return <ResumeClient />
}
