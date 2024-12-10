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

// Add this new function to generate random avatar URL
const getRandomAvatar = (seed: string, style: "pixel-art" | "adventurer" | "big-smile" | "bottts" | "fun-emoji" | "lorelei") => {
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}`;
};

// Update the getChillMessage function to return both message and avatar
function getChillMessage(percentage: number, username: string): { 
  message: string; 
  avatarUrl: string; 
} {
  // AI-generated messages based on chill percentage
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
      
      // Increment user count on successful fetch
      await fetch('/api/user-count', {
        method: 'POST',
      })

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

    const shareableUrl = `${window.location.origin}/dashboard/${username}`;
    const shareMessage = `🚀 Check out my Chill Developer Score on ChillGits! Am I a chill dev? Find out here!`;
    
    // Social media share URLs with better preview text
    const shareUrls = {
      x: `https://x.com/intent/tweet?text=${encodeURIComponent(shareMessage)}&url=${encodeURIComponent(shareableUrl)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareableUrl)}&quote=${encodeURIComponent(shareMessage)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareableUrl)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(`${shareMessage}\n\n${shareableUrl}`)}`,
    };

    // Create and show share menu
    const menu = document.createElement('div');
    menu.className = `
      fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
      bg-black/40 backdrop-blur-xl rounded-xl border border-white/10
      p-2 z-50 min-w-[200px] shadow-xl
    `;
    
    const shareOptions = [
      { name: 'X (Twitter)', icon: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z', url: shareUrls.x },
      { name: 'Facebook', icon: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z', url: shareUrls.facebook },
      { name: 'LinkedIn', icon: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z', url: shareUrls.linkedin },
      { name: 'WhatsApp', icon: 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z', url: shareUrls.whatsapp },
    ];

    const menuContent = `
      <div class="space-y-1">
        ${shareOptions.map(option => `
          <a href="${option.url}" target="_blank" rel="noopener noreferrer"
             class="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors text-white/70 hover:text-white/90">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="${option.icon}"/>
            </svg>
            <span class="text-sm">${option.name}</span>
          </a>
        `).join('')}
        <button id="copy-link" class="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors text-white/70 hover:text-white/90">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
          </svg>
          <span class="text-sm">Copy link</span>
        </button>
      </div>
    `;

    menu.innerHTML = menuContent;
    document.body.appendChild(menu);

    // Handle click outside to close
    const closeMenu = (e: MouseEvent) => {
      if (!menu.contains(e.target as Node)) {
        document.body.removeChild(menu);
        document.removeEventListener('mousedown', closeMenu);
      }
    };
    document.addEventListener('mousedown', closeMenu);

    // Handle copy link button
    const copyButton = menu.querySelector('#copy-link');
    copyButton?.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(shareableUrl);
        
        // Update button text temporarily
        const originalContent = copyButton.innerHTML;
        copyButton.innerHTML = `
          <svg class="w-4 h-4 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span class="text-sm text-green-400">Copied!</span>
        `;
        
        setTimeout(() => {
          copyButton.innerHTML = originalContent;
        }, 2000);
      } catch (error) {
        console.error('Failed to copy:', error);
      }
    });
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

                  <div className="flex items-center gap-2">
                    <motion.button 
                      onClick={downloadAsImage}
                      className="p-2 rounded-full hover:bg-white/5 transition-colors"
                      aria-label="Download dashboard as image"
                    >
                      <Download className="w-5 h-5 text-white/70" />
                    </motion.button>
                    <motion.button
                      onClick={shareAsPNG}
                      className="p-2 rounded-full hover:bg-white/5 transition-colors"
                      aria-label="Share dashboard"
                    >
                      <Share2 className="w-5 h-5 text-white/70" />
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
          <CardTitle className="text-lg sm:text-xl mb-4 text-green-400 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Image 
                src="/95c.png" 
                alt="Chill Guy" 
                className="w-6 h-6 object-contain"
                width={24}
                height={24}
                priority
              />
              Chill Guy Flatter
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {content ? (
            <div className="text-sm sm:text-md text-gray-300 leading-relaxed p-2 sm:p-4">
              {content.split(' ').map((word, index) => (
                <motion.span
                  key={index}
                  className="inline-block mr-1"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.5 }}
                >
                  {word}
                </motion.span>
              ))}
            </div>
          ) : (
            <div className="min-h-[100px] flex flex-col items-center justify-center gap-3 p-8 bg-gradient-to-r from-transparent via-green-500/5 to-transparent animate-pulse">
              <div className="flex items-center gap-2 text-green-400/90">
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                <span className="text-sm font-medium">AI is analyzing...</span>
              </div>
              <div className="text-xs text-green-400/70">Generating your personalized chill score</div>
            </div>
          )}
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
          <Card className={`p-4 sm:p-6 rounded-xl ${glassStyle} ${neonBorderStyle}`}>
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
              <Skeleton className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-green-700/30 animate-pulse" />
              <div className="space-y-3 text-center sm:text-left">
                <Skeleton className="h-6 sm:h-8 w-36 sm:w-48 bg-green-700/30 animate-pulse" />
                <Skeleton className="h-4 w-24 sm:w-32 bg-green-700/30 animate-pulse" />
                <Skeleton className="h-4 w-48 sm:w-64 bg-green-700/30 animate-pulse" />
              </div>
            </div>
          </Card>

          <Card className={`p-4 sm:p-6 rounded-xl ${glassStyle} ${neonBorderStyle}`}>
            <Skeleton className="h-6 sm:h-8 w-36 sm:w-48 mb-4 sm:mb-6 bg-green-700/30 animate-pulse" />
            <Skeleton className="h-36 sm:h-48 w-full bg-green-700/30 animate-pulse" />
          </Card>

          <div className="absolute inset-0 flex items-center justify-center z-20">
            <div className="flex flex-col items-center gap-3 text-white">
              <svg className="animate-spin h-10 w-10 text-green-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
              <span className="text-lg font-semibold text-green-400">AI is analyzing...</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
