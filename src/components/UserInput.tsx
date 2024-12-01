"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Github, Loader2 } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"
import { ToastAction } from "@/components/ui/toast"

interface UsernameInputProps {
  onSubmit: (username: string) => void
}

export function UsernameInput({ onSubmit }: UsernameInputProps) {
  const [username, setUsername] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (username.trim()) {
      setIsLoading(true)
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        onSubmit(username.trim())
      } catch (error) {
        console.error('Error:', error)
        toast({
          title: "Uh-oh! Something went wrong.",
          description: "Failed to fetch GitHub data. Please try again.",
          variant: "destructive",
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        })
      } finally {
        setIsLoading(false)
      }
    } else {
      toast({
        title: "Username required",
        description: "Please enter a GitHub username.",
        variant: "default",
      })
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden"
      >
        <form onSubmit={handleSubmit} className="relative z-10 flex flex-col items-center gap-6 rounded-3xl p-8">
          <div className="text-center">
            <motion.h1 
              className="text-4xl sm:text-6xl font-bold bg-gradient-to-r from-green-400 to-blue-500 text-transparent bg-clip-text"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
            >
              Chill Git
            </motion.h1>
            <motion.p 
              className="mt-2 text-sm text-green-300/70 italic"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              You&apos;re a Developer, But You&apos;re Also a Chill Guy
            </motion.p>
          </div>
          <div className="w-full max-w-md flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Input
                  type="text"
                  placeholder="GitHub Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border-2 border-green-500/30 focus:border-green-500/60 rounded-full transition-all duration-300 ease-in-out text-green-300 placeholder-green-500/50"
                  disabled={isLoading}
                />
                <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500/60 w-5 h-5" />
              </motion.div>
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={isLoading ? 'loading' : 'idle'}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <Button 
                  type="submit" 
                  className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 transition-all duration-300 ease-in-out rounded-full px-6 py-3 text-white font-semibold shadow-lg hover:shadow-xl"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Loading
                    </>
                  ) : (
                    'Generate'
                  )}
                </Button>
              </motion.div>
            </AnimatePresence>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

