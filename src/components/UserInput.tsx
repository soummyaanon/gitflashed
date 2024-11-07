"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

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
    <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4 mb-8">
      <Input
        type="text"
        placeholder="Enter GitHub username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="max-w-xs"
      />
      <Button type="submit">Generate Dashboard</Button>
    </form>
  )
}