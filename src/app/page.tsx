"use client"

import { useState, useEffect } from 'react'
import ResponsiveMinimalisticGitHubDashboard from '@/components/GitHubDashboard'
import { Footer } from '@/components/Footer'
import { Github, Plus, Users } from 'lucide-react'
import Image from 'next/image'
import Head from 'next/head'
import { motion, animate } from "framer-motion"

function CountingNumber({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    // Smoother animation directly to the target value
    animate(0, value, {
      duration: 2,
      ease: [0.34, 1.56, 0.64, 1], // Custom spring-like easing
      onUpdate: (v) => setDisplayValue(Math.round(v))
    })
  }, [value])

  return <span>{displayValue.toLocaleString()}</span>
}

export default function Home() {
  const [userCount, setUserCount] = useState<number>(0)

  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const response = await fetch('/api/user-count')
        const data = await response.json()
        setUserCount(data.count)
      } catch (error) {
        console.error('Error fetching user count:', error)
      }
    }

    fetchUserCount()
    const interval = setInterval(fetchUserCount, 60000)
    return () => clearInterval(interval)
  }, [])

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
        
        {/* Enhanced User Count Display */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed top-0 left-0 right-0 sm:top-8 sm:left-auto sm:right-8 z-50 p-3 sm:p-0"
        >
          <div className="bg-transparent backdrop-blur-[2px] rounded-2xl
                        transition-all duration-300 hover:backdrop-blur-[4px]
                        w-full sm:w-auto">
            {/* Mobile Layout */}
            <div className="block sm:hidden p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-white/50" />
                  <h2 className="text-xl font-bold text-white/80 tracking-tight">
                    <CountingNumber value={userCount} />
                  </h2>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-white/50">
                    Active Profiles
                  </p>
                </div>
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden sm:flex flex-col items-center p-6 min-w-[280px] md:min-w-[320px]">
              <div className="flex items-center justify-center gap-3 mb-3">
                <Users className="w-8 h-8 text-white/50" />
                <h2 className="text-3xl md:text-4xl font-bold text-white/80 tracking-tight">
                  <CountingNumber value={userCount} />
                </h2>
              </div>
              <div className="text-center">
                <p className="text-base md:text-lg text-white/60 font-medium">
                  Generated ChillGits
                </p>
                <p className="text-sm md:text-base text-white/40 mt-1">
                  Join the growing community
                </p>
              </div>
            </div>
          </div>
        </motion.div>

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

