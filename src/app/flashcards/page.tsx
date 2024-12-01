import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import FlashcardGrid from '@/components/FlashcardGrid'
import { Flashcard } from '@/types'

interface PageParams {
  username: string
}

interface PageProps {
  params: Promise<PageParams> | undefined
}

export default async function FlashcardsPage({ params }: PageProps) {
  if (!params) {
    notFound()
  }

  const resolvedParams = await Promise.resolve(params)
  const username = resolvedParams?.username

  if (!username) {
    notFound()
  }

  const flashcardsResponse = await fetch(`/api/generate-flashcards?username=${username}`)
  const flashcardsData: Flashcard[] = await flashcardsResponse.json()

  const formattedFlashcards = flashcardsData.map(card => ({
    id: card.id || Math.random().toString(36),
    title: card.title,
    content: typeof card.content === 'string' ? card.content : JSON.stringify(card.content)
  }))

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Flashcards for {username}
      </h1>
      <Suspense fallback={<div>Loading flashcards...</div>}>
        <FlashcardGrid username={username} flashcards={formattedFlashcards} />
      </Suspense>
    </main>
  )
}