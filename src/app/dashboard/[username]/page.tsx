"use client"

import { Metadata } from 'next';
import ResponsiveMinimalisticGitHubDashboard from '@/components/GitHubDashboard';
import { Footer } from '@/components/Footer';
import { Github, Plus } from 'lucide-react';
import Image from 'next/image';
import Head from 'next/head';

type Props = {
  params: Promise<{ username: string }>;
};

// Generate dynamic metadata for each user's dashboard
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const { username } = resolvedParams;
  const isNew = username === 'new';

  return {
    title: isNew ? 'ChillGits - Visualize Your GitHub Profile in Style' : `${username}'s GitHub Dashboard | ChillGits`,
    description: isNew 
      ? 'Transform your GitHub profile into a beautiful, shareable dashboard with ChillGits.'
      : `Check out ${username}'s GitHub stats and chill factor on ChillGits!`,
    openGraph: {
      title: isNew ? 'ChillGits - GitHub Profile Visualizer' : `${username}'s GitHub Dashboard | ChillGits`,
      description: isNew 
        ? 'Transform your GitHub profile into a beautiful, shareable dashboard.'
        : `Check out ${username}'s GitHub stats and chill factor on ChillGits!`,
      images: [
        {
          url: isNew ? '/95c.png' : `/api/og?username=${username}`,
          width: 1200,
          height: 630,
          alt: isNew ? 'ChillGits Dashboard Preview' : `${username}'s GitHub Dashboard`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: isNew ? 'ChillGits - GitHub Profile Visualizer' : `${username}'s GitHub Dashboard | ChillGits`,
      description: isNew 
        ? 'Create a beautiful dashboard from your GitHub profile.'
        : `Check out ${username}'s GitHub stats and chill factor on ChillGits!`,
      images: [isNew ? '/95c.png' : `/api/og?username=${username}`],
    },
  };
}

export default async function Page({ params }: Props) {
  const resolvedParams = await params;
  const { username } = resolvedParams;
  const isNew = username === 'new';

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-green-900 text-white relative flex flex-col">
      <h1 className="sr-only">ChillGits - GitHub Profile Visualization Tool</h1>
      
      {isNew && (
        <div className="absolute inset-0">
          <div className="flex flex-col md:flex-row justify-between items-center h-full px-4 md:px-12 lg:px-24 gap-8 md:gap-16 lg:gap-32">
            <div className="flex-1 opacity-10 flex justify-center w-full md:w-1/3">
              <Github className="w-full h-full text-green-500 scale-50 md:scale-75" />
            </div>
            <div className="flex justify-center items-center">
              <Plus className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 text-green-500 opacity-10" />
            </div>
            <div className="flex-1 flex justify-center w-full md:w-1/3 h-64 md:h-full relative">
              <Image 
                src="/95c.png"
                alt="Background pattern"
                width={500}
                height={500}
                className="opacity-5 scale-50 md:scale-95"
              />
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8 relative z-10 flex-grow">
        <ResponsiveMinimalisticGitHubDashboard initialUsername={isNew ? undefined : username} />
      </div>

      <div className="relative z-20">
        <Footer />
      </div>
    </main>
  );
} 