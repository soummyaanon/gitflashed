"use client"

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, Variants } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { UsernameInput } from './UserInput'
import { GitHubData, Flashcard } from '@/types'
import { Share2, Github, Download, RefreshCw, Plus } from 'lucide-react'
import html2canvas from 'html2canvas'
import Image from 'next/image'
import { ChillGitText } from '@/components/ui/DecorativeSVG'
import Link from 'next/link'

const CHILL_MESSAGES = {
  legendary: [
    { 
      quote: "🎉 LEGENDARY CHILL LEVEL ACHIEVED! You're the Bob Ross of coding! 🎨",
      avatar: "pixel-art"
    },
    { 
      quote: "🌟 YOU'RE THE ZEN MASTER OF GITHUB! Even Linus would be proud! 🐧",
      avatar: "bottts"
    },
    { 
      quote: "🎸 PEAK CHILL VIBES DETECTED! You're the Django of development! 🎵",
      avatar: "fun-emoji"
    },
    { 
      quote: "🏆 MAXIMUM CHILL STATUS UNLOCKED! You're like Docker - containing all the cool! 🐳",
      avatar: "adventurer"
    }
  ],
  regular: [
    {
      quote: "Keeping it cool like Python's whitespace! 🐍",
      avatar: "pixel-art"
    },
    {
      quote: "Debugging with the chill of a thousand clouds! ☁️",
      avatar: "bottts"
    },
    {
      quote: "Your code is as smooth as a well-cached Redis instance! 🚀",
      avatar: "adventurer"
    },
    {
      quote: "Git pushing through life with style! 🎮",
      avatar: "fun-emoji"
    },
    {
      quote: "Your commits are like haikus - simple and beautiful! 📝",
      avatar: "lorelei"
    },
    {
      quote: "Floating like a butterfly, coding like a Bee(language)! 🐝",
      avatar: "big-smile"
    },
    {
      quote: "You're like npm - packaging awesomeness! 📦",
      avatar: "pixel-art"
    },
    {
      quote: "Your code reviews spread joy like React components! ⚛️",
      avatar: "bottts"
    }
  ]
};

const itemAnimation: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.9 },
  show: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { 
      type: "spring", 
      stiffness: 300, 
      damping: 24,
      duration: 0.5
    } 
  }
}

const MotionCard = motion(Card)
MotionCard.defaultProps = {
  whileHover: { scale: 1.02, transition: { duration: 0.2 } },
  whileTap: { scale: 0.98 }
}

function downloadAsImage() {
  const element = document.getElementById('github-profile-card')
  if (!element) return

  try {
    document.body.style.cursor = 'wait'
    
    html2canvas(element, {
      backgroundColor: '#1a1b1e',
      scale: 3,
      logging: false,
      useCORS: true,
      allowTaint: true,
      onclone: (clonedDoc) => {
        const clonedElement = clonedDoc.getElementById('github-profile-card')
        if (clonedElement) {
          clonedElement.style.transform = 'none'
          const images = clonedElement.getElementsByTagName('img')
          return Promise.all(Array.from(images).map(img => {
            if (img.complete) return Promise.resolve()
            return new Promise(resolve => {
              img.onload = resolve
              img.onerror = resolve
            })
          }))
        }
      }
    }).then(canvas => {
      const image = canvas.toDataURL('image/png', 1.0)
      const link = document.createElement('a')
      const timestamp = new Date().toISOString().split('T')[0]
      link.download = `chillgits-dashboard-${timestamp}.png`
      link.href = image
      link.click()
    }).finally(() => {
      document.body.style.cursor = 'default'
    })
  } catch (err) {
    console.error('Error generating image:', err)
    document.body.style.cursor = 'default'
    alert('Failed to generate image. Please try again.')
  }
}

function calculateChillPercentage(githubData: GitHubData): number {
  if (!githubData || !githubData.user) return 80 // Default fallback

  const {
    public_repos = 0,
    followers = 0,
    following = 0,
  } = githubData.user

  // Calculate repository activity (35% weight)
  const repoScore = Math.min(public_repos / 50, 1) * 35

  // Calculate social engagement (35% weight)
  const socialScore = Math.min(
    ((followers * 1.5) + following) / 150,
    1
  ) * 35

  // Calculate contribution consistency (30% weight)
  const activityScore = Math.min(
    (githubData.pinnedRepos?.length || 0) / 6 +
    (githubData.recentActivity?.length || 0) / 5,
    1
  ) * 30

  const baseScore = repoScore + socialScore + activityScore


  const normalizedScore = 80 + (baseScore / 100) * 20

  return Math.round(normalizedScore)
}

const glassStyle = "backdrop-filter backdrop-blur-lg bg-opacity-20 bg-black/30 shadow-xl"
const neonBorderStyle = "animate-border-pulse border border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.2)]"
const decorativeStyle = "before:absolute before:inset-0 before:bg-gradient-to-br before:from-green-500/5 before:to-transparent before:z-0"

const buttonBaseStyle = `
  flex items-center gap-2 
  px-4 py-2.5 
  rounded-lg
  font-medium
  text-sm
  transition-all duration-200
  backdrop-filter backdrop-blur-sm
  shadow-sm
  border border-green-500/10
`

const primaryButtonStyle = `
  ${buttonBaseStyle}
  bg-green-500/10
  hover:bg-green-500/20
  text-green-400
  hover:text-green-300
  hover:shadow-md
  hover:shadow-green-500/10
  hover:border-green-500/20
`

const secondaryButtonStyle = `
  ${buttonBaseStyle}
  bg-gray-800/40
  hover:bg-gray-800/60
  text-gray-300
  hover:text-gray-200
  hover:shadow-md
  hover:shadow-black/10
`

// Add this new function to generate random avatar URL
const getRandomAvatar = (seed: string, style: "pixel-art" | "adventurer" | "big-smile" | "bottts" | "fun-emoji" | "lorelei") => {
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}`;
};

// Update the getChillMessage function to return both message and avatar
function getChillMessage(percentage: number, username: string): { 
  message: string; 
  avatarUrl: string; 
} {
  const messages = percentage >= 99 ? CHILL_MESSAGES.legendary : CHILL_MESSAGES.regular;
  const randomChoice = messages[Math.floor(Math.random() * messages.length)];
  
  return {
    message: randomChoice.quote,
    avatarUrl: getRandomAvatar(username + Date.now(), randomChoice.avatar as "pixel-art" | "adventurer" | "big-smile" | "bottts" | "fun-emoji" | "lorelei")
  };
}

export default function ResponsiveMinimalisticGitHubDashboard({ initialUsername }: { initialUsername?: string }) {
  const [username, setUsername] = useState<string | null>(initialUsername || null)
  const [githubData, setGithubData] = useState<GitHubData | null>(null)
  const [flashcards, setFlashcards] = useState<Flashcard[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isRegenerating, setIsRegenerating] = useState(false)
  const [chillPercentage, setChillPercentage] = useState<number>(0)
  const [chillMessage, setChillMessage] = useState<string>('')
  const [messageAvatar, setMessageAvatar] = useState<string>('')
  const dashboardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (username) {
      fetchData(username)
    }
  }, [username])

  async function fetchData(username: string) {
    setLoading(true)
    setError(null)
    try {
      const githubResponse = await fetch(`/api/github-dashboard?username=${username}`, {
        headers: {
          'Accept': 'application/json',
        },
      });
  
      if (!githubResponse.ok) {
        const errorData = await githubResponse.json();
        throw new Error(errorData.error || 'Failed to fetch GitHub data');
      }
  
      const githubData = await githubResponse.json();
      setGithubData(githubData);
      
      setChillPercentage(calculateChillPercentage(githubData))
      const { message, avatarUrl } = getChillMessage(calculateChillPercentage(githubData), githubData.user.login);
      setChillMessage(message)
      setMessageAvatar(avatarUrl)
  
      const flashcardsResponse = await fetch(`/api/generate-flashcards?username=${username}`);
      if (!flashcardsResponse.ok) {
        const errorData = await flashcardsResponse.json();
        throw new Error(errorData.error || 'Failed to generate flashcards');
      }
  
      const flashcardsData = await flashcardsResponse.json();
      setFlashcards(flashcardsData);
  
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load dashboard data';
      setError(errorMessage);
      console.error('Dashboard Error:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleUsernameSubmit = (newUsername: string) => {
    setUsername(newUsername)
  }

  const regenerateFlatter = async () => {
    if (!username) return
    setIsRegenerating(true)
    try {
      const response = await fetch(`/api/generate-flashcards?username=${username}`)
      if (!response.ok) {
        throw new Error('Failed to regenerate flatter')
      }
      const newFlashcards = await response.json()
      setFlashcards(newFlashcards)
    } catch (err) {
      console.error('Error regenerating flatter:', err)
    } finally {
      setIsRegenerating(false)
    }
  }

  const shareAsPNG = async () => {
    if (!username) return;

    // Create a shareable URL with the username
    const shareableUrl = `${window.location.origin}/dashboard/${username}`;
    
    try {
      await navigator.clipboard.writeText(shareableUrl);
      alert('Dashboard link copied to clipboard! 🎉');
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      // Fallback for browsers that don't support clipboard API
      const tempInput = document.createElement('input');
      tempInput.value = shareableUrl;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand('copy');
      document.body.removeChild(tempInput);
      alert('Dashboard link copied to clipboard! 🎉');
    }
  };

  return (
    <div className="min-h-screen p-4 relative overflow-hidden">
      <div className="w-full max-w-4xl mx-auto space-y-8">
        {!initialUsername && (
          <div className="flex flex-col items-center gap-4">
            <Image 
              src="/95c.png" 
              alt="Chill Guy" 
              className="w-20 h-20 object-contain"
              width={80}
              height={80}
            />
            <div className="w-full">
              <UsernameInput onSubmit={handleUsernameSubmit} />
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ResponsiveDashboardSkeleton />
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-center space-y-2"
            >
              <div className="text-red-500">{error}</div>
              <p className="text-sm text-green-300/70 italic">
                No worries! Stay chill and try another username
              </p>
            </motion.div>
          ) : githubData ? (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              {!initialUsername ? (
                <div className="container mx-auto px-2 py-1 max-w-3xl flex flex-wrap justify-end items-center gap-3">
                  <motion.button 
                    onClick={regenerateFlatter} 
                    disabled={isRegenerating}
                    className={`${primaryButtonStyle} ${isRegenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <RefreshCw size={16} className={`${isRegenerating ? 'animate-spin' : ''} transition-transform`} />
                    <span className="whitespace-nowrap">New Flatter</span>
                  </motion.button>

                  <div className="flex gap-3">
                    <motion.button 
                      onClick={downloadAsImage} 
                      className={secondaryButtonStyle}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      title="Save as Image"
                    >
                      <Download size={16} className="transition-transform group-hover:translate-y-0.5" />
                      <span className="whitespace-nowrap">Save</span>
                    </motion.button>

                    <motion.button 
                      onClick={shareAsPNG}
                      className={secondaryButtonStyle}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      title="Share Profile"
                    >
                      <Share2 size={16} className="transition-transform group-hover:rotate-12" />
                      <span className="whitespace-nowrap">Share</span>
                    </motion.button>
                  </div>
                </div>
              ) : (
                <div className="text-center mb-6">
                  <Link 
                    href="/"
                    className={`
                      inline-flex items-center gap-2 
                      px-6 py-3
                      rounded-lg
                      font-medium
                      bg-green-500/10
                      hover:bg-green-500/20
                      text-green-400
                      hover:text-green-300
                      transition-all duration-200
                      shadow-sm
                      hover:shadow-md
                      hover:shadow-green-500/10
                      border border-green-500/10
                      hover:border-green-500/20
                      backdrop-filter backdrop-blur-sm
                    `}
                  >
                    <span className="flex items-center gap-2">
                      <Plus size={16} className="transition-transform group-hover:rotate-90" />
                      ✨ Create Your Own CHILLGITS
                    </span>
                  </Link>
                </div>
              )}

              <div 
                id="github-profile-card" 
                ref={dashboardRef} 
                className={`relative rounded-lg p-4 ${glassStyle} ${neonBorderStyle} ${decorativeStyle}`}
              >
                <div className="relative z-10 space-y-4">
                  <MotionCard 
                    variants={itemAnimation} 
                    className={`p-3 rounded-lg ${glassStyle} hover:shadow-green-500/20 hover:shadow-lg transition-all duration-300 ${neonBorderStyle}`}
                  >
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
                        <Link 
                          href={`https://github.com/${githubData.user.login}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover:text-green-400 transition-colors"
                        >
                          <Github size={24} className="text-green-400/30" />
                        </Link>
                      </div>
                    </motion.div>
                  </MotionCard>

                  <AnimatedAppreciationCard content={flashcards[0]?.content} />

                  <motion.div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <MotionCard 
                      variants={itemAnimation} 
                      className={`p-4 rounded-lg ${glassStyle} hover:shadow-green-500/20 hover:shadow-lg transition-all duration-300 ${neonBorderStyle}`}
                    >
                      <CardHeader className="p-0">
                        <CardTitle className="text-base mb-4 text-green-400 flex items-center gap-3">
                          <Image 
                            src="/95c.png" 
                            alt="Chill Guy" 
                            className="w-12 h-12 object-contain"
                            width={48}
                            height={48}
                            priority
                          />
                          <div className="flex flex-col gap-1">
                            <div className="flex items-baseline gap-2">
                              <span>@{githubData.user.login} is</span>
                              <motion.span 
                                className={`
                                  text-3xl
                                  font-bold 
                                  ${chillPercentage >= 99 ? 'text-green-300 animate-pulse' : 'text-green-400'}
                                  tracking-wider
                                  px-1
                                `}
                                initial={{ scale: 0.9 }}
                                animate={{ 
                                  scale: chillPercentage >= 99 ? [1, 1.1, 1] : 1,
                                  transition: {
                                    repeat: chillPercentage >= 99 ? Infinity : 0,
                                    duration: 2
                                  }
                                }}
                              >
                                {chillPercentage}%
                              </motion.span>
                              <span className="text-green-300">Chill</span>
                            </div>
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-0 mt-2">
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center justify-center gap-3">
                            <Image 
                              src={messageAvatar}
                              alt="Mood Avatar"
                              width={32}
                              height={32}
                              className="rounded-full w-8 h-8"
                              priority
                            />
                            <motion.p 
                              className={`
                                text-sm 
                                ${chillPercentage >= 99 ? 'text-green-300 font-semibold' : 'text-gray-300 italic'}
                              `}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.2 }}
                            >
                              {chillMessage}
                            </motion.p>
                          </div>
                        </div>
                      </CardContent>
                    </MotionCard>
                  </motion.div>
                </div>
                
                <div className="absolute bottom-4 right-4 z-20">
                  <ChillGitText 
                    className="
                      w-32 h-auto
                      text-green-400/40
                      transform-gpu
                      hover:text-green-400/60
                      transition-colors duration-300
                    "
                  />
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  )
}

function AnimatedAppreciationCard({ content }: { content?: string }) {
  return (
    <MotionCard 
      className={`p-4 sm:p-6 rounded-xl relative overflow-hidden ${glassStyle} ${neonBorderStyle} ${decorativeStyle}`}
    >
      <div className="relative z-10">
        <CardHeader className="p-0">
          <CardTitle className="text-lg sm:text-xl mb-4 text-green-400 flex items-center gap-2">
            <Image 
              src="/95c.png" 
              alt="Chill Guy" 
              className="w-6 h-6 object-contain"
              width={24}
              height={24}
              priority
            />
            Chill Guy Flatter
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="text-sm sm:text-md text-gray-300 leading-relaxed">
            <div className="relative p-2 sm:p-4">
              {content?.split(' ').map((word, index) => (
                <motion.span
                  key={index}
                  className="inline-block mr-1"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.5 }}
                >
                  {word}
                </motion.span>
              )) || "Loading your profile..."}
            </div>
          </div>
        </CardContent>
      </div>
    </MotionCard>
  )
}

function ResponsiveDashboardSkeleton() {
  return (
    <div className="container mx-auto px-4 max-w-3xl relative">
      <Card 
        className={`p-4 sm:p-6 rounded-xl relative overflow-hidden ${glassStyle} ${neonBorderStyle} ${decorativeStyle}`}
      >
        <div className="space-y-4 relative z-10">
          <Card 
            className={`p-4 sm:p-6 rounded-xl ${glassStyle} ${neonBorderStyle}`}
          >
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
              <Skeleton className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-green-700/30 animate-pulse" />
              <div className="space-y-3 text-center sm:text-left">
                <Skeleton className="h-6 sm:h-8 w-36 sm:w-48 bg-green-700/30 animate-pulse" />
                <Skeleton className="h-4 w-24 sm:w-32 bg-green-700/30 animate-pulse" />
                <Skeleton className="h-4 w-48 sm:w-64 bg-green-700/30 animate-pulse" />
              </div>
            </div>
          </Card>

          <Card 
            className={`p-4 sm:p-6 rounded-xl ${glassStyle} ${neonBorderStyle}`}
          >
            <Skeleton className="h-6 sm:h-8 w-36 sm:w-48 mb-4 sm:mb-6 bg-green-700/30 animate-pulse" />
            <Skeleton className="h-36 sm:h-48 w-full bg-green-700/30 animate-pulse" />
          </Card>
        </div>
      </Card>
    </div>
  )
}
