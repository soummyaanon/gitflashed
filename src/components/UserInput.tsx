"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Github } from 'lucide-react'

interface UsernameInputProps {
  onSubmit: (username: string) => void
}

export function UsernameInput({ onSubmit }: UsernameInputProps) {
  const [username, setUsername] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (username.trim()) {
      onSubmit(username.trim())
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 sm:py-12 md:py-16">
      <form onSubmit={handleSubmit} className="flex flex-col items-center gap-6 sm:gap-8 md:gap-10">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-green-400 text-center mb-4 sm:mb-6">
          GitHub Flatter
        </h1>
        <p className="text-lg sm:text-xl text-green-300/70 italic text-center mb-6 sm:mb-8">
          Discover your GitHub journey in style!
        </p>
        <div className="w-full max-w-2xl flex flex-col sm:flex-row items-center gap-4">
          <div className="relative w-full">
            <Input
              type="text"
              placeholder="Your GitHub Handle"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full text-lg sm:text-xl py-6 pl-12 pr-4 rounded-full bg-gray-800/50 border-2 border-green-500/30 focus:border-green-500/60 transition-all duration-300 ease-in-out"
            />
            <Github className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-500/60 w-6 h-6" />
          </div>
          <Button 
            type="submit" 
            className="w-full sm:w-auto text-lg sm:text-xl py-6 px-8 rounded-full bg-green-500 hover:bg-green-600 text-white font-semibold transition-all duration-300 ease-in-out"
          >
            Generate Flatter
          </Button>
        </div>

      </form>
    </div>
  )
}

