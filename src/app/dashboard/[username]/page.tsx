import { Metadata } from 'next'
import ResponsiveMinimalisticGitHubDashboard from '@/components/GitHubDashboard'

type Props = {
  params: Promise<{ username: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params
  const username = resolvedParams.username
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://chillgits.vercel.app'
  
  const title = `${username}'s Chill Developer Score | ChillGits`
  const description = `🧊 Is ${username} a chill developer? Check out their Chill Score and see how relaxed their coding style is! #ChillGits`
  const imageUrl = `${baseUrl}/api/og?username=${username}`

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
        alt: `${username}'s Chill Developer Score`,
        type: 'image/png',
        secureUrl: imageUrl,
      }],
      type: 'website',
      siteName: 'ChillGits',
      locale: 'en_US',
      url: `${baseUrl}/dashboard/${username}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `🧊 ${username}'s Chill Developer Score`,
      description: `Is ${username} a chill developer? Find out their Chill Score now! #ChillGits`,
      images: {
        url: imageUrl,
        alt: `${username}'s Chill Developer Score`,
        width: 1200,
        height: 630,
        type: 'image/png',
      },
      creator: '@ChillGits',
      site: '@ChillGits',
      creatorId: '1234567890', // Replace with your actual Twitter ID
    },
    alternates: {
      canonical: `${baseUrl}/dashboard/${username}`,
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
    metadataBase: new URL(baseUrl),
  }
}

// Add JSON-LD structured data
function generateStructuredData(username: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://chillgits.vercel.app'
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'ChillGits',
    applicationCategory: 'DeveloperApplication',
    description: `🧊 Check out ${username}'s Chill Developer Score! See how relaxed their coding style is.`,
    url: `${baseUrl}/dashboard/${username}`,
    author: {
      '@type': 'Person',
      name: 'Soumyaranjan Panda',
      url: 'https://github.com/soummyaanon'
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    },
    screenshot: {
      '@type': 'ImageObject',
      url: `${baseUrl}/api/og?username=${username}`,
      width: '1200',
      height: '630'
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