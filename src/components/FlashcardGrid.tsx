import { Flashcard } from '@/components/Flashcard'

async function getFlashcards(username: string) {
  const res = await fetch(`/api/generate-flashcards?username=${username}`, { cache: 'no-store' })
  if (!res.ok) {
    throw new Error('Failed to fetch flashcards')
  }
  return res.json()
}

export default async function FlashcardGrid({ username }: { username: string }) {
  const flashcards = await getFlashcards(username)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {flashcards.map((flashcard: any, index: number) => (
        <Flashcard key={index} {...flashcard} />
      ))}
    </div>
  )
}