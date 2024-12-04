import { Metadata } from 'next';
import ResponsiveMinimalisticGitHubDashboard from '@/components/GitHubDashboard';

type Props = {
  params: { username: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

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

export default function Page({ params }: Props) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
      <ResponsiveMinimalisticGitHubDashboard initialUsername={params.username} />
    </div>
  );
} 