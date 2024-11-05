import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import FlashcardGrid from '@/components/FlashcardGrid'

export default function FlashcardsPage({ params }: { params: { username: string } }) {
  const { username } = params

  if (!username) {
    notFound()
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Flashcards for {username}</h1>
      <Suspense fallback={<div>Loading flashcards...</div>}>
        <FlashcardGrid username={username} />
      </Suspense>
    </main>
  )
}