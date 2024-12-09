"use client"

import ResponsiveMinimalisticGitHubDashboard from '@/components/GitHubDashboard'
import { Footer } from '@/components/Footer'
import { Github, Plus } from 'lucide-react'
import Image from 'next/image'
import Head from 'next/head'

export default function Home() {
  return (
    <>
      <Head>
        <title>ChillGits - Visualize Your GitHub Profile in Style</title>
        <meta name="description" content="Transform your GitHub profile into a beautiful, shareable dashboard with ChillGits. Showcase your repositories, contributions, and activities in a unique way." />
        <meta name="keywords" content="GitHub, Developer Profile, Portfolio, Git Statistics, Open Source" />
        
        {/* Open Graph / Social Media Meta Tags */}
        <meta property="og:title" content="ChillGits - Visualize Your GitHub Profile" />
        <meta property="og:description" content="Transform your GitHub profile into a beautiful, shareable dashboard." />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/95c.png" />
        <meta property="og:url" content="https://chillgits.vercel.app" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="ChillGits - GitHub Profile Visualizer" />
        <meta name="twitter:description" content="Create a beautiful dashboard from your GitHub profile." />
        <meta name="twitter:image" content="/95c.png" />
        
        {/* Additional SEO Meta Tags */}
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Soumyaranjan Panda" />
        <link rel="canonical" href="https://chillgits.vercel.app" />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-gray-900 to-green-900 text-white relative flex flex-col">
        <h1 className="sr-only">ChillGits - GitHub Profile Visualization Tool</h1>
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
                style={{ objectFit: 'contain' }}
              />
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 py-8 relative z-10 flex-grow">
          <ResponsiveMinimalisticGitHubDashboard />
        </div>
        <div className="relative z-20">
          <Footer />
        </div>
      </main>
    </>
  )
}

