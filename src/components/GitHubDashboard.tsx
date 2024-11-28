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
import { Share2, Github, Download } from 'lucide-react'
import html2canvas from 'html2canvas'

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
    const width = 300 - margin.left - margin.right
    const height = 100 - margin.top - margin.bottom

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
    <div className="w-full h-[100px] relative">
      <svg ref={svgRef} className="w-full h-full"></svg>
    </div>
  )
}

const downloadAsImage = async () => {
  const element = document.getElementById('github-profile-card')
  if (!element) return

  try {
    const originalBackground = element.style.background
    element.style.background = '#1a1b1e'
    
    const canvas = await html2canvas(element, {
      backgroundColor: '#1a1b1e',
      scale: 2,
      logging: false,
      useCORS: true,
      allowTaint: true,
      onclone: (clonedDoc) => {
        const clonedElement = clonedDoc.getElementById('github-profile-card')
        if (clonedElement) {
          clonedElement.style.transform = 'none'
        }
      }
    })

    element.style.background = originalBackground

    const image = canvas.toDataURL('image/png', 1.0)
    const link = document.createElement('a')
    link.download = 'github-profile.png'
    link.href = image
    link.click()
  } catch (err) {
    console.error('Error generating image:', err)
  }
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
      <div className="h-screen overflow-hidden flex items-center justify-center">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex flex-col items-center gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="flex items-center gap-2 whitespace-nowrap">
                <h1 className="text-2xl sm:text-3xl font-bold text-green-400">Github flatter</h1>
              </div>
              <div className="w-11 sm:w-auto">
                <UsernameInput onSubmit={handleUsernameSubmit} />
              </div>
              <img 
                src="/95c.png" 
                alt="Chill Guy" 
                className="w-25 h-25 sm:w-25 sm:h-25 object-contain hidden sm:block"
              />
            </div>
            
            <p className="text-sm text-green-300/70 italic text-center">
              Inspired by chill guy meme - keeping it cool while checking your GitHub stats
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="h-screen overflow-hidden flex items-center justify-center">
        <ResponsiveDashboardSkeleton />
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-screen overflow-hidden flex items-center justify-center">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="text-red-500 text-center">{error}</div>
              <img 
                src="/95c.png" 
                alt="Chill Guy" 
                className="w-8 h-8 object-contain opacity-50"
              />
            </div>
            <UsernameInput onSubmit={handleUsernameSubmit} />
          </div>
        </div>
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
    <>
      {/* Share Buttons */}
      <div className="container mx-auto px-2 py-1 max-w-3xl flex justify-between items-center gap-1.5">
        {/* Logo and Image on the left */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold text-green-400">Github flatter</span>
          <img 
            src="/95c.png" 
            alt="Chill Guy" 
            className="w-8 h-8 object-contain"
          />
        </div>
        
        {/* Existing buttons on the right */}
        <div className="flex gap-1.5">
          <button onClick={downloadAsImage} className="flex items-center gap-1.5 px-4 py-2 bg-green-500/20 rounded-lg hover:bg-green-500/30">
            <Download size={14} />
            <span className="text-sm">Save</span>
          </button>
          <button onClick={() => {
            window.open(
              `https://twitter.com/intent/tweet?text=Check out my GitHub stats!&url=${encodeURIComponent(window.location.href)}`,
              '_blank'
            );
          }} className="flex items-center gap-1.5 px-4 py-2 bg-green-500/20 rounded-lg hover:bg-green-500/30">
            <Share2 size={14} />
            <span className="text-sm">Share</span>
          </button>
        </div>
      </div>

      <div className="container mx-auto px-1 max-w-3xl">
        <div id="github-profile-card" className="relative bg-[#1a1b1e]/90 rounded-lg p-2 border border-green-500/20">
          {/* Profile Section with Appreciation Card */}
          <div className="space-y-4">
            
            {/* Profile Card */}
            <MotionCard variants={itemAnimation} className="p-3 bg-gray-800/50 backdrop-blur-sm rounded-lg border border-green-500/20">
              <motion.div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
                <Avatar className="w-14 h-14 border-2 border-green-500">
                  <AvatarImage src={githubData.user.avatar_url} alt={githubData.user.name || githubData.user.login} />
                  <AvatarFallback>{githubData.user.login.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="text-center sm:text-left flex-grow">
                  <motion.h2 className="text-lg font-semibold text-green-400">
                    {githubData.user.name || githubData.user.login}
                  </motion.h2>
                  <motion.p className="text-xs text-green-300">@{githubData.user.login}</motion.p>
                  <motion.p className="text-xs mt-1.5 text-gray-300">
                    {githubData.user.bio || "You don't need a bio to be a great developer!"}
                  </motion.p>
                </div>
                <div className="hidden sm:block">
                  <Github size={24} className="text-green-400/30" />
                </div>
              </motion.div>
            </MotionCard>

            {/* Fun Appreciation Card */}
            <div className="mt-4">
              <AnimatedAppreciationCard content={flashcards[0]?.content} />
            </div>
          </div>

          {/* Stats and Activity Section */}
          <div className="mt-6 space-y-4">
            {/* Stats Grid */}
            <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <MotionCard variants={itemAnimation} className="p-3 bg-gray-800/50 backdrop-blur-sm rounded-lg border border-green-500/20">
                <CardHeader className="p-0">
                  <CardTitle className="text-base mb-2 text-green-400">Repository Stats</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <AnimatedStat label="Repos" value={githubData.user.public_repos} />
                    <AnimatedStat label="Followers" value={githubData.user.followers} />
                    <AnimatedStat label="Following" value={githubData.user.following} />
                  </div>
                </CardContent>
              </MotionCard>

              {/* Pinned Repos Card */}
              <MotionCard variants={itemAnimation} className="p-3 bg-gray-800/50 backdrop-blur-sm rounded-lg border border-green-500/20">
                <CardHeader className="p-0">
                  <CardTitle className="text-base mb-2 text-green-400">Pinned Repos</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {githubData.pinnedRepos.slice(0, 2).map((repo, index) => (
                    <motion.div 
                      key={index} 
                      className="mb-2 last:mb-0"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <h3 className="text-xs font-semibold text-green-300">{repo.name}</h3>
                      <p className="text-xs text-gray-400 mb-1 line-clamp-1">
                        {repo.description || "No description available"}
                      </p>
                      <div className="flex items-center gap-1.5">
                        <Badge variant="secondary" className="text-[10px] bg-green-700/50 text-green-100">⭐ {repo.stars}</Badge>
                        <Badge variant="outline" className="text-[10px] border-green-500/50 text-green-300">{repo.language}</Badge>
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </MotionCard>

              {/* Recent Activity Card */}
              <MotionCard variants={itemAnimation} className="p-3 bg-gray-800/50 backdrop-blur-sm rounded-lg border border-green-500/20">
                <CardHeader className="p-0">
                  <CardTitle className="text-base mb-2 text-green-400">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <ul className="space-y-2">
                    {githubData.recentActivity.slice(0, 3).map((activity, index) => (
                      <motion.li 
                        key={index} 
                        className="flex items-center gap-1.5 text-[10px]"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Badge variant="outline" className="text-[10px] whitespace-nowrap border-green-500/50 text-green-300">{activity.type}</Badge>
                        <span className="truncate text-gray-300">{activity.repo}</span>
                        <span className="text-gray-400 ml-auto whitespace-nowrap">{activity.date}</span>
                      </motion.li>
                    ))}
                  </ul>
                </CardContent>
              </MotionCard>
            </motion.div>

            {/* Activity Graph */}
            <MotionCard variants={itemAnimation} className="p-3 bg-gray-800/50 backdrop-blur-sm rounded-lg border border-green-500/20">
              <CardHeader className="p-0">
                <CardTitle className="text-base mb-2 text-green-400">Activity Over Time</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <StatsVisualization stats={githubData.user} />
                <div className="mt-3 grid grid-cols-3 gap-3 text-center">
                  <div className="text-[10px]">
                    <p className="text-green-300 font-semibold">Peak Activity</p>
                    <span className="text-gray-400">23 commits</span>
                  </div>
                  <div className="text-[10px]">
                    <p className="text-green-300 font-semibold">Average</p>
                    <span className="text-gray-400">8 commits/day</span>
                  </div>
                  <div className="text-[10px]">
                    <p className="text-green-300 font-semibold">Total</p>
                    <span className="text-gray-400">142 commits</span>
                  </div>
                </div>
              </CardContent>
            </MotionCard>
          </div>
        </div>
      </div>
    </>
  )
}

function AnimatedStat({ label, value }: { label: string, value: number }) {
  return (
    <motion.div>
      <motion.p 
        className="text-lg font-bold text-green-300"
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

function AnimatedAppreciationCard({ content }: { content?: string }) {
  return (
    <MotionCard className="p-6 bg-gray-800/30 backdrop-blur-sm rounded-xl border border-green-500/20">
      <CardHeader className="p-0">
        <CardTitle className="text-xl mb-4 text-green-400 flex items-center gap-2">
          <img 
            src="/95c.png" 
            alt="Chill Guy" 
            className="w-6 h-6 object-contain"
          />
          Welcome
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="text-md text-gray-300 leading-relaxed">
          <div className="relative p-4">
            <p className="font-medium">
              {content || "Loading your profile..."}
            </p>
          </div>
        </div>
      </CardContent>
    </MotionCard>
  )
}

function AppreciationCard({ content }: { content?: string }) {
  return (
    <Card className="p-6 bg-gray-800/30 backdrop-blur-sm rounded-xl border border-green-500/20">
      <CardHeader className="p-0">
        <CardTitle className="text-lg mb-4 text-green-400 flex items-center gap-2">
          <Github size={20} className="text-green-400" />
          A Note of Appreciation
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="prose prose-invert prose-green max-w-none">
          <div className="space-y-4">
            <p className="text-md font-medium italic text-green-400/90 border-l-4 border-green-400/30 pl-4">
              "While others might create GitHub roasting apps, I'm here to celebrate your coding journey!"
            </p>
            <p className="text-sm text-gray-300 leading-relaxed font-medium">
              {content || "Loading your developer story..."}
            </p>
          </div>
        </div>
      </CardContent>
      <div className="mt-4 pt-4 border-t border-green-500/10">
        <p className="text-xs text-green-400/60 italic">
          "Code is like humor. When you have to explain it, it's bad." - Cory House
        </p>
      </div>
    </Card>
  )
}

function ResponsiveDashboardSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center justify-center gap-3 mb-8">
        <h1 className="text-3xl font-bold text-green-400">GitHub Dashboard</h1>
        <img 
          src="/95c.png" 
          alt="Chill Guy" 
          className="w-10 h-10 object-contain"
        />
      </div>
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