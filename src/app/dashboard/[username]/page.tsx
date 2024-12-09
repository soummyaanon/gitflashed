import { Metadata } from 'next'
import ResponsiveMinimalisticGitHubDashboard from '@/components/GitHubDashboard'

type Props = {
  params: Promise<{ username: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params
  const username = resolvedParams.username
  
  const title = `${username}'s Chill Developer Score | ChillGits`
  const description = `Is ${username} a chill developer? Check out their Chill Score and GitHub profile visualization on ChillGits! See coding patterns, contribution style, and overall developer vibe.`
  const imageUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/og?username=${username}`

  return {
    title,
    description,
    keywords: [
      'GitHub Profile',
      'Developer Score',
      'Chill Developer',
      'GitHub Stats',
      'Code Analysis',
      username,
      'Developer Profile',
      'GitHub Visualization',
      'ChillGits',
      'Developer Metrics'
    ],
    authors: [{ name: 'Soumyaranjan Panda' }],
    openGraph: {
      title,
      description,
      images: [{
        url: imageUrl,
        width: 1200,
        height: 630,
        alt: `${username}'s Chill Developer Score`
      }],
      type: 'website',
      siteName: 'ChillGits',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
      creator: '@ChillGits',
      site: '@ChillGits',
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/${username}`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    },
    metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://chillgits.vercel.app'),
  }
}

// Add JSON-LD structured data
function generateStructuredData(username: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'ChillGits',
    applicationCategory: 'DeveloperApplication',
    description: `Analyze ${username}'s GitHub profile and calculate their Chill Developer Score`,
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/${username}`,
    author: {
      '@type': 'Person',
      name: 'Soumyaranjan Panda',
      url: 'https://github.com/soummyaanon'
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    }
  }
}

export default async function DashboardPage({ params }: Props) {
  const resolvedParams = await params
  const username = resolvedParams.username
  const structuredData = generateStructuredData(username)

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-green-900 text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <ResponsiveMinimalisticGitHubDashboard initialUsername={username} />
    </main>
  )
} 