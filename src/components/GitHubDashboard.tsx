"use client"

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence,Variants } from "framer-motion"
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
const containerAnimation: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemAnimation: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      type: "spring", 
      stiffness: 300, 
      damping: 24 
    } 
  }
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

    const line = d3.line<ActivityData>()
      .x(d => x(d.date))
      .y(d => y(d.count))
      .curve(d3.curveCatmullRom)

    svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "rgb(16, 185, 129)")
      .attr("stroke-width", 2)
      .attr("d", line)

    const tooltip = d3.select(svgRef.current.parentNode as HTMLElement)
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0)
      .style("position", "absolute")
      .style("background-color", "rgba(0, 0, 0, 0.7)")
      .style("color", "white")
      .style("padding", "5px")
      .style("border-radius", "5px")
      .style("pointer-events", "none")

    svg.selectAll(".dot")
      .data(data)
      .enter().append("circle")
      .attr("class", "dot")
      .attr("cx", d => x(d.date))
      .attr("cy", d => y(d.count))
      .attr("r", 4)
      .attr("fill", "rgb(16, 185, 129)")
      .on("mouseover", (event, d) => {
        tooltip.transition()
          .duration(200)
          .style("opacity", .9)
        tooltip.html(`Date: ${d.date.toLocaleDateString()}<br/>Count: ${d.count}`)
          .style("left", (event.pageX + 5) + "px")
          .style("top", (event.pageY - 28) + "px")
      })
      .on("mouseout", () => {
        tooltip.transition()
          .duration(500)
          .style("opacity", 0)
      })

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
    <div className="w-full h-[150px] relative">
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
        <h1 className="text-3xl font-bold text-center mb-8 text-green-400">GitHub Dashboard</h1>
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
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemAnimation = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-center mb-8 text-green-400">GitHub Dashboard for {username}</h1>
      <UsernameInput onSubmit={handleUsernameSubmit} />
      
      <motion.div
        variants={containerAnimation}
        initial="hidden"
        animate="show"
        className="space-y-6"
      >
        {/* User Profile Card */}
        <MotionCard variants={itemAnimation} className="p-6 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-green-500/20 overflow-hidden">
          <motion.div 
            className="flex flex-col sm:flex-row items-center sm:items-start gap-6"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
          >
            <Avatar className="w-24 h-24 border-2 border-green-500">
              <AvatarImage src={githubData.user.avatar_url} alt={githubData.user.name || githubData.user.login} />
              <AvatarFallback>{githubData.user.login.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="text-center sm:text-left">
              <motion.h2 
                className="text-2xl font-semibold text-green-400"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {githubData.user.name || githubData.user.login}
              </motion.h2>
              <motion.p 
                className="text-sm text-green-300"
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                @{githubData.user.login}
              </motion.p>
              <motion.p 
                className="text-sm mt-2 text-gray-300"
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {githubData.user.bio || "No bio available"}
              </motion.p>
            </div>
          </motion.div>
        </MotionCard>

        {/* Activity Graph Card */}
        <MotionCard variants={itemAnimation} className="p-6 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-green-500/20">
          <CardHeader className="p-0">
            <CardTitle className="text-xl mb-4 text-green-400">Activity Over Time</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <StatsVisualization stats={githubData.user} />
          </CardContent>
        </MotionCard>

        {/* Stats Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={containerAnimation}
          initial="hidden"
          animate="show"
        >
          <MotionCard variants={itemAnimation} className="p-6 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-green-500/20">
            <CardHeader className="p-0">
              <CardTitle className="text-xl mb-4 text-green-400">Repository Stats</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid grid-cols-3 gap-4 text-center">
                <AnimatedStat label="Repos" value={githubData.user.public_repos} />
                <AnimatedStat label="Followers" value={githubData.user.followers} />
                <AnimatedStat label="Following" value={githubData.user.following} />
              </div>
            </CardContent>
          </MotionCard>

          {/* Pinned Repos Card */}
          <MotionCard variants={itemAnimation} className="p-6 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-green-500/20">
            <CardHeader className="p-0">
              <CardTitle className="text-xl mb-4 text-green-400">Pinned Repos</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {githubData.pinnedRepos.slice(0, 2).map((repo, index) => (
                <motion.div 
                  key={index} 
                  className="mb-4 last:mb-0"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <h3 className="text-sm font-semibold text-green-300">{repo.name}</h3>
                  <p className="text-xs text-gray-400 mb-2 line-clamp-2">
                    {repo.description || "No description available"}
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs bg-green-700/50 text-green-100">⭐ {repo.stars}</Badge>
                    <Badge variant="outline" className="text-xs border-green-500/50 text-green-300">{repo.language}</Badge>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </MotionCard>

          {/* Recent Activity Card */}
          <MotionCard variants={itemAnimation} className="p-6 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-green-500/20">
            <CardHeader className="p-0">
              <CardTitle className="text-xl mb-4 text-green-400">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ul className="space-y-3">
                {githubData.recentActivity.slice(0, 3).map((activity, index) => (
                  <motion.li 
                    key={index} 
                    className="flex items-center gap-2 text-xs"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Badge variant="outline" className="text-xs whitespace-nowrap border-green-500/50 text-green-300">{activity.type}</Badge>
                    <span className="truncate text-gray-300">{activity.repo}</span>
                    <span className="text-gray-400 ml-auto whitespace-nowrap">{activity.date}</span>
                  </motion.li>
                ))}
              </ul>
            </CardContent>
          </MotionCard>
        </motion.div>

        {/* AI Insights Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={containerAnimation}
          initial="hidden"
          animate="show"
        >
          <AnimatedInsightCard title="Appreciation" content={flashcards[0]?.content} />
          <AnimatedInsightCard title="Activity Summary" content={flashcards[1]?.content} />
          <AnimatedInsightCard title="Improvement Suggestion" content={flashcards[2]?.content} />
        </motion.div>
      </motion.div>
    </div>
  )
}

function AnimatedStat({ label, value }: { label: string, value: number }) {
  return (
    <motion.div
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <motion.p 
        className="text-2xl font-bold text-green-300"
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {value}
      </motion.p>
      <p className="text-xs text-gray-400">{label}</p>
    </motion.div>
  )
}

function AnimatedInsightCard({ title, content }: { title: string, content?: string }) {
  return (
    <MotionCard 
      variants={itemAnimation} 
      className="p-6 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-green-500/20"
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <CardHeader className="p-0">
        <CardTitle className="text-xl mb-4 text-green-400">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <motion.p 
          className="text-sm text-gray-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {content || `No ${title.toLowerCase()} available`}
        </motion.p>
      </CardContent>
    </MotionCard>
  )
}

function ResponsiveDashboardSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-center mb-8 text-green-400">GitHub Dashboard</h1>
      <Card className="p-6 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-green-500/20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="col-span-1 lg:col-span-3 p-6 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-green-500/20">
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

          <Card className="col-span-1 lg:col-span-3 p-6 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-green-500/20">
            <Skeleton className="h-8 w-48 mb-6 bg-green-700/30" />
            <Skeleton className="h-48 w-full bg-green-700/30" />
          </Card>

          {[...Array(3)].map((_, i) => (
            <Card key={i} className="p-6 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-green-500/20">
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