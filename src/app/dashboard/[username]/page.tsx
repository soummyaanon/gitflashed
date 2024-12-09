import { Metadata } from 'next'
import ResponsiveMinimalisticGitHubDashboard from '@/components/GitHubDashboard'

type Props = {
  params: Promise<{ username: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params
  const username = resolvedParams.username
  
  const title = `${username}'s Chill Developer Score | ChillGits`
  const description = `Is ${username} a chill developer? Check out their Chill Score and GitHub profile visualization on ChillGits!`
  const imageUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/og?username=${username}`

  return {
    title,
    description,
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
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
      creator: '@ChillGits',
    },
  }
}

export default async function DashboardPage({ params }: Props) {
  const resolvedParams = await params
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-green-900 text-white">
      <ResponsiveMinimalisticGitHubDashboard initialUsername={resolvedParams.username} />
    </main>
  )
} 