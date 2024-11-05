'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface Flashcard {
  title: string
  description: string
  content: string
}

export default function Home() {
  const [username, setUsername] = useState('')
  const [flashcards, setFlashcards] = useState<Flashcard[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username) return

    setLoading(true)
    setError('')
    setFlashcards([])

    try {
      const response = await fetch(`/api/generate-flashcards?username=${username}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch flashcards')
      }

      setFlashcards(data)
    } catch (err) {
      if (err instanceof Error) {
        setError(`Error: ${err.message}`)
      } else {
        setError('An unknown error occurred.')
      }
      console.error('Detailed error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">GitHub Flashcard Generator</h1>
      
      <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4 mb-8">
        <Input
          type="text"
          placeholder="Enter GitHub username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="max-w-xs"
        />
        <Button type="submit" disabled={loading}>
          {loading ? 'Generating...' : 'Generate Flashcards'}
        </Button>
      </form>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {flashcards.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {flashcards.map((flashcard, index) => (
            <Card key={index} className="h-full">
              <CardHeader>
                <CardTitle>{flashcard.title}</CardTitle>
                <CardDescription>{flashcard.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>{flashcard.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </main>
  )
}