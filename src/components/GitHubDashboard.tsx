"use client"

import { useState, useEffect, useRef } from 'react'
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { UsernameInput } from './UserInput'
import { GitHubData, Flashcard, GitHubStats } from '@/types'
import * as d3 from 'd3'

interface ActivityData {
  date: Date;
  count: number;
}

const MotionCard = motion(Card)

function StatsVisualization({ stats }: { stats: GitHubStats }) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current) return

    const margin = { top: 10, right: 10, bottom: 20, left: 30 }
    const width = 400 - margin.left - margin.right
    const height = 150 - margin.top - margin.bottom

    d3.select(svgRef.current).selectAll("*").remove()

    const svg = d3.select(svgRef.current)
      .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`)

    const data: ActivityData[] = Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000),
      count: Math.floor(Math.random() * 10)
    }))

    const x = d3.scaleTime()
      .domain(d3.extent(data, d => d.date) as [Date, Date])
      .range([0, width])

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.count) as number])
      .range([height, 0])

    const gradient = svg.append("defs")
      .append("linearGradient")
      .attr("id", "areaGradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "0%")
      .attr("y2", "100%")

    gradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "rgba(16, 185, 129, 0.5)")
      .attr("stop-opacity", 0.8)

    gradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "rgba(16, 185, 129, 0.1)")
      .attr("stop-opacity", 0.2)

    const area = d3.area<ActivityData>()
      .x(d => x(d.date))
      .y0(height)
      .y1(d => y(d.count))
      .curve(d3.curveMonotoneX)

    svg.append("path")
      .datum(data)
      .attr("fill", "url(#areaGradient)")
      .attr("d", area)

    const line = d3.line<ActivityData>()
      .x(d => x(d.date))
      .y(d => y(d.count))
      .curve(d3.curveMonotoneX)

    svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "rgb(16, 185, 129)")
      .attr("stroke-width", 2)
      .attr("d", line)

    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).ticks(4).tickFormat(d3.timeFormat("%b %d") as any))
      .call(g => g.select(".domain").remove())
      .call(g => g.selectAll(".tick line").attr("stroke", "rgba(255, 255, 255, 0.2)"))
      .call(g => g.selectAll(".tick text").attr("fill", "rgba(255, 255, 255, 0.7)"))

    svg.append("g")
      .call(d3.axisLeft(y).ticks(4))
      .call(g => g.select(".domain").remove())
      .call(g => g.selectAll(".tick line").attr("stroke", "rgba(255, 255, 255, 0.2)"))
      .call(g => g.selectAll(".tick text").attr("fill", "rgba(255, 255, 255, 0.7)"))

  }, [stats])

  return (
    <div className="w-full h-[150px]">
      <svg ref={svgRef} className="w-full h-full"></svg>
    </div>
  )
}

export default function ResponsiveMinimalisticGitHubDashboard() {
  const [username, setUsername] = useState<string | null>(null)
  const [githubData, setGithubData] = useState<GitHubData | null>(null)
  const [flashcards, setFlashcards] = useState<Flashcard[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (username) {
      fetchData(username)
    }
  }, [username])

  async function fetchData(username: string) {
    setLoading(true)
    setError(null)
    try {
      const [githubResponse, flashcardsResponse] = await Promise.all([
        fetch(`/api/github-dashboard?username=${username}`),
        fetch(`/api/generate-flashcards?username=${username}`)
      ])

      if (!githubResponse.ok || !flashcardsResponse.ok) {
        throw new Error('Failed to fetch data')
      }

      const githubData = await githubResponse.json()
      const flashcardsData = await flashcardsResponse.json()

      setGithubData(githubData)
      setFlashcards(flashcardsData)
    } catch (err) {
      setError('Failed to load dashboard data')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleUsernameSubmit = (newUsername: string) => {
    setUsername(newUsername)
  }

  if (!username) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-2xl font-bold text-center mb-4 text-green-400">GitHub Dashboard</h1>
        <UsernameInput onSubmit={handleUsernameSubmit} />
      </div>
    )
  }

  if (loading) {
    return <ResponsiveDashboardSkeleton />
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-red-500 text-center">{error}</div>
        <UsernameInput onSubmit={handleUsernameSubmit} />
      </div>
    )
  }

  if (!githubData) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center text-green-400">No data available</div>
        <UsernameInput onSubmit={handleUsernameSubmit} />
      </div>
    )
  }

  const containerAnimation = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemAnimation = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl bg-gradient-to-br from-gray-900 to-green-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold text-center mb-8 text-green-400">GitHub Dashboard for {username}</h1>
      <UsernameInput onSubmit={handleUsernameSubmit} />
      
      <motion.div
        variants={containerAnimation}
        initial="hidden"
        animate="show"
        className="space-y-6"
      >
        {/* User Profile Card */}
        <MotionCard variants={itemAnimation} className="p-6 bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl border border-green-500/20">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <Avatar className="w-24 h-24 border-4 border-green-500">
              <AvatarImage src={githubData.user.avatar_url} alt={githubData.user.name || githubData.user.login} />
              <AvatarFallback>{githubData.user.login.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-semibold text-green-400">{githubData.user.name || githubData.user.login}</h2>
              <p className="text-sm text-green-300">@{githubData.user.login}</p>
              <p className="text-sm mt-2 text-gray-300">{githubData.user.bio || "No bio available"}</p>
            </div>
          </div>
        </MotionCard>

        {/* Activity Graph Card */}
        <MotionCard variants={itemAnimation} className="p-6 bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl border border-green-500/20">
          <CardHeader className="p-0">
            <CardTitle className="text-xl mb-4 text-green-400">Activity Over Time</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <StatsVisualization stats={githubData.user} />
          </CardContent>
        </MotionCard>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MotionCard variants={itemAnimation} className="p-6 bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl border border-green-500/20">
            <CardHeader className="p-0">
              <CardTitle className="text-xl mb-4 text-green-400">Repository Stats</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-green-300">{githubData.user.public_repos}</p>
                  <p className="text-xs text-gray-400">Repos</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-300">{githubData.user.followers}</p>
                  <p className="text-xs text-gray-400">Followers</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-300">{githubData.user.following}</p>
                  <p className="text-xs text-gray-400">Following</p>
                </div>
              </div>
            </CardContent>
          </MotionCard>

          {/* Pinned Repos Card */}
          <MotionCard variants={itemAnimation} className="p-6 bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl border border-green-500/20">
            <CardHeader className="p-0">
              <CardTitle className="text-xl mb-4 text-green-400">Pinned Repos</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {githubData.pinnedRepos.slice(0, 2).map((repo, index) => (
                <div key={index} className="mb-4 last:mb-0">
                  <h3 className="text-sm font-semibold text-green-300">{repo.name}</h3>
                  <p className="text-xs text-gray-400 mb-2 line-clamp-2">
                    {repo.description || "No description available"}
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs bg-green-700 text-green-100">⭐ {repo.stars}</Badge>
                    <Badge variant="outline" className="text-xs border-green-500 text-green-300">{repo.language}</Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </MotionCard>

          {/* Recent Activity Card */}
          <MotionCard variants={itemAnimation} className="p-6 bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl border border-green-500/20">
            <CardHeader className="p-0">
              <CardTitle className="text-xl mb-4 text-green-400">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ul className="space-y-3">
                {githubData.recentActivity.slice(0, 3).map((activity, index) => (
                  <li key={index} className="flex items-center gap-2 text-xs">
                    <Badge variant="outline" className="text-xs whitespace-nowrap border-green-500 text-green-300">{activity.type}</Badge>
                    <span className="truncate text-gray-300">{activity.repo}</span>
                    <span className="text-gray-400 ml-auto whitespace-nowrap">{activity.date}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </MotionCard>
        </div>

        {/* AI Insights Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MotionCard variants={itemAnimation} className="p-6 bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl border border-green-500/20">
            <CardHeader className="p-0">
              <CardTitle className="text-xl mb-4 text-green-400">Appreciation</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <p className="text-sm text-gray-300">
                {flashcards[0]?.content || "No appreciation available"}
              </p>
            </CardContent>
          </MotionCard>

          <MotionCard variants={itemAnimation} className="p-6 bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl border border-green-500/20">
            <CardHeader className="p-0">
              <CardTitle className="text-xl mb-4 text-green-400">Activity Summary</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <p className="text-sm text-gray-300">
                {flashcards[1]?.content || "No activity summary available"}
              </p>
            </CardContent>
          </MotionCard>

          <MotionCard variants={itemAnimation} className="p-6 bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl border border-green-500/20">
            <CardHeader className="p-0">
              <CardTitle className="text-xl mb-4 text-green-400">Improvement Suggestion</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <p className="text-sm text-gray-300">
                {flashcards[2]?.content || "No suggestions available"}
              </p>
            </CardContent>
          </MotionCard>
        </div>
      </motion.div>
    </div>
  )
}

function ResponsiveDashboardSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl bg-gradient-to-br from-gray-900 to-green-900 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8 text-green-400">GitHub Dashboard</h1>
      <Card className="p-6 bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl border border-green-500/20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="col-span-1 lg:col-span-3 p-6 bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl border border-green-500/20">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <Skeleton className="w-24 h-24 rounded-full bg-green-700/30" />
              <div className="space-y-3 text-center sm:text-left">
                <Skeleton className="h-8 w-48 bg-green-700/30" />
                <Skeleton className="h-4 w-32 bg-green-700/30" />
                <Skeleton className="h-4 w-64 bg-green-700/30" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-6 text-center">
              {[...Array(3)].map((_, i) => (
                <div key={i}>
                  <Skeleton className="h-8 w-16 mx-auto mb-2 bg-green-700/30" />
                  <Skeleton className="h-4 w-20 mx-auto bg-green-700/30" />
                </div>
              ))}
            </div>
          </Card>

          <Card className="col-span-1 lg:col-span-3 p-6 bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl border border-green-500/20">
            <Skeleton className="h-8 w-48 mb-6 bg-green-700/30" />
            <Skeleton className="h-48 w-full bg-green-700/30" />
          </Card>

          {[...Array(3)].map((_, i) => (
            <Card key={i} className="p-6 bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl border border-green-500/20">
              <Skeleton className="h-8 w-48 mb-6 bg-green-700/30" />
              <div className="space-y-3">
                <Skeleton className="h-4 w-full bg-green-700/30" />
                <Skeleton className="h-4 w-5/6 bg-green-700/30" />
                <Skeleton className="h-4 w-4/6 bg-green-700/30" />
              </div>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  )
}