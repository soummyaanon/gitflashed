"use client"

import ResponsiveMinimalisticGitHubDashboard from '@/components/GitHubDashboard'
import { Github, Plus } from 'lucide-react'
import Image from 'next/image'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-green-900 text-white relative">
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
              layout="fill"
              objectFit="contain"
              className="opacity-5 scale-50 md:scale-95"
            />
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8 relative z-10">
        <ResponsiveMinimalisticGitHubDashboard />
      </div>
    </main>
  )
}

