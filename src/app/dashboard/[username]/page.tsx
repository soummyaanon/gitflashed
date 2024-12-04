import { Metadata } from 'next';
import ResponsiveMinimalisticGitHubDashboard from '@/components/GitHubDashboard';

interface PageProps {
  params: {
    username: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
}

// Generate dynamic metadata for each user's dashboard
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username } = params;

  return {
    title: `${username}'s GitHub Dashboard | ChillGits`,
    description: `Check out ${username}'s GitHub stats and chill factor on ChillGits!`,
    openGraph: {
      title: `${username}'s GitHub Dashboard | ChillGits`,
      description: `Check out ${username}'s GitHub stats and chill factor on ChillGits!`,
      images: [
        {
          url: `/api/og?username=${username}`,
          width: 1200,
          height: 630,
          alt: `${username}'s GitHub Dashboard`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${username}'s GitHub Dashboard | ChillGits`,
      description: `Check out ${username}'s GitHub stats and chill factor on ChillGits!`,
      images: [`/api/og?username=${username}`],
    },
  };
}

export default function DashboardPage({ params }: PageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black py-8">
      <div className="max-w-4xl mx-auto">
        <ResponsiveMinimalisticGitHubDashboard initialUsername={params.username} />
      </div>
    </div>
  );
} 