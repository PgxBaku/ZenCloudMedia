import type { Metadata } from 'next'
import ResumeClient from '../../../resume/ResumeClient'

export const metadata: Metadata = {
  title: 'Paul P. Xiong Resume Story | ZenCloudMedia',
  description:
    'Interactive career timeline for Paul P. Xiong, from enterprise integration leadership across Microsoft Fabric, Data Lake, and MuleSoft to current ZenCloudMedia AI automation work.',
  alternates: {
    canonical: '/pgx/resume/story',
  },
  openGraph: {
    title: 'Paul P. Xiong Resume Story',
    description:
      'Interactive career timeline from senior engineering through solutions architecture, engineering management, and ZenCloudMedia AI automation.',
    images: ['/zencloudmedia-logo.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Paul P. Xiong Resume Story',
    description:
      'Animated resume story for enterprise integration leadership and current ZenCloudMedia AI automation work.',
    images: ['/zencloudmedia-logo.png'],
  },
}

export default function PgxResumeStoryPage() {
  return <ResumeClient />
}
