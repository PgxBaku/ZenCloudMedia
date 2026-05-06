import type { Metadata } from 'next'
import ResumeClient from './ResumeClient'

export const metadata: Metadata = {
  title: 'Resume — Paul P. Xiong | ZenCloudMedia',
  description:
    'Engineering Manager with deep AI capability. 15+ years across .NET, Python, MuleSoft, Next.js, and AI/Copilot. Former Sr Engineer at ConvergeOne, now building ZenCloudMedia.',
  openGraph: {
    title: 'Resume — Paul P. Xiong | Engineering Manager',
    description:
      'Career journey: Sr Engineer → Solutions Architect → Lead Architect → Dev Manager → ZenCloudMedia founder.',
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
