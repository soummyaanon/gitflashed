"use client"

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, Variants } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { UsernameInput } from './UserInput'
import { GitHubData, Flashcard } from '@/types'
import { Share2, Github, Download, RefreshCw } from 'lucide-react'
import html2canvas from 'html2canvas'
import Image from 'next/image'

const CHILL_MESSAGES = [
  "Keeping it cool while coding awesome stuff! 😎",
  "Debugging with a smile! 🌟",
  "Writing code and vibing! 🎵",
  "Turning coffee into code, chillingly! ☕",
  "Just another day in paradise... coding! 🌴",
  "Stay cool, keep coding! 🧊",
  "Crafting digital magic, no stress! ✨",
  "Chillin' in the code zone! 🚀",
  "Making bugs disappear, smoothly! 🪄",
  "Code. Relax. Repeat. 🎮"
  
];

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

function downloadAsImage() {
  const element = document.getElementById('github-profile-card')
  if (!element) return

  try {
    const originalBackground = element.style.background
    element.style.background = '#1a1b1e'
    
    html2canvas(element, {
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
    }).then(canvas => {
      element.style.background = originalBackground

      const image = canvas.toDataURL('image/png', 1.0)
      const link = document.createElement('a')
      link.download = 'github-profile.png'
      link.href = image
      link.click()
    })
  } catch (err) {
    console.error('Error generating image:', err)
  }
}

const getRandomChillPercentage = () => {
  return Math.floor(Math.random() * (20) + 80); // Returns a number between 80-100
}

export default function ResponsiveMinimalisticGitHubDashboard() {
  const [username, setUsername] = useState<string | null>(null)
  const [githubData, setGithubData] = useState<GitHubData | null>(null)
  const [flashcards, setFlashcards] = useState<Flashcard[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isRegenerating, setIsRegenerating] = useState(false)
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
    const element = document.getElementById('github-profile-card')
    if (!element) return;

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
      });

      element.style.background = originalBackground

      canvas.toBlob(async (blob) => {
        if (blob) {
          const file = new File([blob], 'github-dashboard.png', { type: 'image/png' });
          
          const twitterShareUrl = `https://twitter.com/intent/tweet?text=Check out my GitHub stats!&url=${encodeURIComponent(window.location.href)}`;
          
          try {
            // Try to share both the PNG and the URL
            await navigator.share({
              files: [file],
              title: 'My GitHub Dashboard',
              text: 'Check out my GitHub stats!',
              url: window.location.href,
            });
          } catch (_) {
            try {
              await navigator.share({
                title: 'My GitHub Dashboard',
                text: 'Check out my GitHub stats!',
                url: window.location.href,
              });
            } catch {
              // If all sharing attempts fail, open Twitter share dialog
              window.open(twitterShareUrl, '_blank', 'width=550,height=420');
            }

            // Also trigger PNG download if sharing failed
            const downloadUrl = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = 'github-dashboard.png';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(downloadUrl);
          }
        }
      }, 'image/png', 1.0);
    } catch (error) {
      console.error('Error sharing as PNG:', error);
    }
  };

  return (
    <div className="min-h-screen p-4 bg-transparent">
      <div className="w-full max-w-4xl mx-auto space-y-8">
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
              <div className="container mx-auto px-2 py-1 max-w-3xl flex flex-wrap justify-between items-center gap-1.5">
                <div className="flex items-center gap-2">
   
                </div>
                
                <div className="flex gap-1.5">
                  <motion.button 
                    onClick={regenerateFlatter} 
                    disabled={isRegenerating}
                    className="flex items-center gap-1.5 px-4 py-2 bg-green-500/20 rounded-lg hover:bg-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <RefreshCw size={14} className={isRegenerating ? "animate-spin" : ""} />
                    <span className="text-sm">New Flatter</span>
                  </motion.button>
                  <motion.button 
                    onClick={downloadAsImage} 
                    className="flex items-center gap-1.5 px-4 py-2 bg-green-500/20 rounded-lg hover:bg-green-500/30"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Download size={30} />
                    <span className="text-sm">Save</span>
                  </motion.button>
                  <motion.button 
                    onClick={shareAsPNG}
                    className="flex items-center gap-1.5 px-4 py-2 bg-green-500/20 rounded-lg hover:bg-green-500/30"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Share2 size={14} />
                    <span className="text-sm">Share</span>
                  </motion.button>
                </div>
              </div>

              <div id="github-profile-card" ref={dashboardRef} className="relative bg-[#1a1b1e]/90 rounded-lg p-4 border border-green-500/20">
                <div className="space-y-4">
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
                        <a 
                          href={`https://github.com/${githubData.user.login}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover:text-green-400 transition-colors"
                        >
                          <Github size={24} className="text-green-400/30" />
                        </a>
                      </div>
                    </motion.div>
                  </MotionCard>

                  <AnimatedAppreciationCard content={flashcards[0]?.content} />

                  <motion.div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <MotionCard variants={itemAnimation} className="p-4 bg-gray-800/50 backdrop-blur-sm rounded-lg border border-green-500/20 hover:border-green-500/30 transition-all duration-300">
                      <CardHeader className="p-0">
                        <CardTitle className="text-base mb-4 text-green-400 flex items-center gap-3">
                          <Image 
                            src="/95c.png" 
                            alt="Chill Guy" 
                            className="w-12 h-12 object-contain"
                            width={48}
                            height={48}
                          />
                          <div className="flex flex-col gap-1">
                            <div className="flex items-baseline gap-2">
                              <span>@{githubData.user.login} is a</span>
                              <motion.span 
                                className="text-xl font-bold bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent"
                                initial={{ scale: 0.9 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.5 }}
                              >
                                {getRandomChillPercentage()}% 
                              </motion.span>
                            </div>
                            <span className="text-lg text-green-300/90">Chill Developer</span>
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-0">
                        <div className="flex items-center justify-center mt-2">
                          <motion.p 
                            className="text-sm text-gray-300 italic"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                          >
                            {CHILL_MESSAGES[Math.floor(Math.random() * CHILL_MESSAGES.length)]}
                          </motion.p>
                        </div>
                      </CardContent>
                    </MotionCard>
                  </motion.div>
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
      className="p-4 sm:p-6 bg-gray-800/30 backdrop-blur-sm rounded-xl border border-green-500/20"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <CardHeader className="p-0">
        <CardTitle className="text-lg sm:text-xl mb-4 text-green-400 flex items-center gap-2">
          <Image 
            src="/95c.png" 
            alt="Chill Guy" 
            className="w-6 h-6 object-contain"
            width={24}
            height={24}
          />
          Chill Guy Flatter
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="text-sm sm:text-md text-gray-300 leading-relaxed">
          <div className="relative p-2 sm:p-4">
            <motion.p 
              className="font-medium"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              {content || "Loading your profile..."}
            </motion.p>
          </div>
        </div>
      </CardContent>
    </MotionCard>
  )
}

function ResponsiveDashboardSkeleton() {
  return (
    <div className="container mx-auto px-4 max-w-3xl">
      <Card className="p-4 sm:p-6 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-green-500/20">
        <div className="space-y-4">
          <Card className="p-4 sm:p-6 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-green-500/20">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
              <Skeleton className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-green-700/30 animate-pulse" />
              <div className="space-y-3 text-center sm:text-left">
                <Skeleton className="h-6 sm:h-8 w-36 sm:w-48 bg-green-700/30 animate-pulse" />
                <Skeleton className="h-4 w-24 sm:w-32 bg-green-700/30 animate-pulse" />
                <Skeleton className="h-4 w-48 sm:w-64 bg-green-700/30 animate-pulse" />
              </div>
            </div>
          </Card>

          <Card className="p-4 sm:p-6 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-green-500/20">
            <Skeleton className="h-6 sm:h-8 w-36 sm:w-48 mb-4 sm:mb-6 bg-green-700/30 animate-pulse" />
            <Skeleton className="h-36 sm:h-48 w-full bg-green-700/30 animate-pulse" />
          </Card>
        </div>
      </Card>
    </div>
  )
}

