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
    // First animate to 100
    animate(0, 100, {
      duration: 1,
      onUpdate: (v) => setDisplayValue(Math.round(v)),
      ease: "easeOut"
    }).then(() => {
      // Then animate down to actual value
      animate(100, value, {
        duration: 0.5,
        onUpdate: (v) => setDisplayValue(Math.round(v)),
        ease: "easeInOut"
      })
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
    // Refresh count every minute
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
          className="absolute top-6 right-6 z-20"
        >
          <div className="bg-black/30 backdrop-blur-lg rounded-xl px-6 py-4 border border-green-500/20 shadow-lg hover:shadow-green-500/10 transition-all duration-300 group">
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6 text-green-400 group-hover:text-green-300 transition-colors" />
              <div>
                <p className="text-2xl font-bold text-green-400 group-hover:text-green-300 transition-colors">
                  <CountingNumber value={userCount} />
                </p>
                <p className="text-sm text-green-500/70">
                  Developers Chilling
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

