import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface FlashcardProps {
  title: string
  description: string
  content: string
}

export function Flashcard({ title, description, content }: FlashcardProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{content}</p>
      </CardContent>
    </Card>
  )
}