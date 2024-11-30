import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Flashcard } from '@/types'
import Image from 'next/image'

interface FlashcardGridProps {
  flashcards: Flashcard[]
  username: string
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
            <Image 
              src="/path/to/image.jpg"
              alt={flashcard.title}
              width={500}
              height={300}
            />
            <p>{flashcard.content}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}