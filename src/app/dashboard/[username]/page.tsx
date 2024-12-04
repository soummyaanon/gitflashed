import { Metadata } from 'next';
import { Suspense } from 'react';
import ResponsiveMinimalisticGitHubDashboard from '@/components/GitHubDashboard';

// Define the shape of the page parameters
type PageParams = {
  username: string;
};

// Define the page props using Next.js conventions
type Props = {
  params: PageParams;
  searchParams: { [key: string]: string | string[] | undefined };
};

// Generate dynamic metadata for each user's dashboard
export async function generateMetadata(props: Props): Promise<Metadata> {
  const { username } = props.params;

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

// Define the page component
export default function Page(props: Props) {
  const { username } = props.params;
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black py-8">
      <div className="max-w-4xl mx-auto">
        <Suspense fallback={<div className="text-center text-white">Loading...</div>}>
          <ResponsiveMinimalisticGitHubDashboard initialUsername={username} />
        </Suspense>
      </div>
    </div>
  );
} 