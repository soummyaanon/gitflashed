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
import { ChillGitText } from '@/components/ui/DecorativeSVG'

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
    html2canvas(element, {
      backgroundColor: '#1a1b1e',
      scale: 2,
      logging: true,
      useCORS: true,
      allowTaint: true,
      onclone: (clonedDoc) => {
        const clonedElement = clonedDoc.getElementById('github-profile-card')
        if (clonedElement) {
          clonedElement.style.transform = 'none'
        }
      }
    }).then(canvas => {
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

const glassStyle = "backdrop-filter backdrop-blur-lg bg-opacity-20 bg-black/30 shadow-xl"
const neonBorderStyle = "animate-border-pulse border border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.2)]"
const decorativeStyle = "before:absolute before:inset-0 before:bg-gradient-to-br before:from-green-500/5 before:to-transparent before:z-0"

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
      const canvas = await html2canvas(element, {
        backgroundColor: '#1a1b1e',
        scale: 2,
        logging: true,
        useCORS: true,
        allowTaint: true,
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.getElementById('github-profile-card')
          if (clonedElement) {
            clonedElement.style.transform = 'none'
          }
        }
      });

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
          } catch {
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
    <div className="min-h-screen p-4 relative overflow-hidden">
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
                
                <div className="flex gap-2">
                  <motion.button 
                    onClick={regenerateFlatter} 
                    disabled={isRegenerating}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500/20 rounded-lg hover:bg-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <RefreshCw size={16} className={isRegenerating ? "animate-spin" : ""} />
                    <span className="text-sm whitespace-nowrap">New Flatter</span>
                  </motion.button>
                  <motion.button 
                    onClick={downloadAsImage} 
                    className="flex items-center gap-2 px-4 py-2 bg-green-500/20 rounded-lg hover:bg-green-500/30 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Download size={16} />
                    <span className="text-sm whitespace-nowrap">Save</span>
                  </motion.button>
                  <motion.button 
                    onClick={shareAsPNG}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500/20 rounded-lg hover:bg-green-500/30 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Share2 size={16} />
                    <span className="text-sm whitespace-nowrap">Share</span>
                  </motion.button>
                </div>
              </div>

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
                          />
                          <div className="flex flex-col gap-1">
                            <div className="flex items-baseline gap-2">
                              <span>@{githubData.user.login} is</span>
                              <motion.span 
                                className="
                                  text-3xl
                                  font-bold 
                                  text-green-400
                                  tracking-wider
                                  px-1
                                "
                                initial={{ scale: 0.9 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.5 }}
                              >
                                {getRandomChillPercentage()}%
                              </motion.span>
                              <span className="text-green-300">Chill</span>
                            </div>
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-0 mt-2">
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center justify-center">
                            <motion.p 
                              className="text-sm text-gray-300 italic"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.2 }}
                            >
                              {CHILL_MESSAGES[Math.floor(Math.random() * CHILL_MESSAGES.length)]}
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

