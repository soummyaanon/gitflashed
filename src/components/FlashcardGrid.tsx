import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Flashcard } from '@/types'

interface FlashcardGridProps {
  flashcards: Flashcard[]
}

export default function FlashcardGrid({ flashcards }: FlashcardGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {flashcards.map((flashcard) => (
        <Card key={flashcard.id} className="flex flex-col">
          <CardHeader>
            <CardTitle>{flashcard.title}</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow">
            <p>{flashcard.content}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}