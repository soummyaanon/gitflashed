"use client"

import ResponsiveMinimalisticGitHubDashboard from '@/components/GitHubDashboard'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-green-900 text-white">
      <div className="container mx-auto px-4 py-8">
        
        <ResponsiveMinimalisticGitHubDashboard />
      </div>
    </main>
  )
}