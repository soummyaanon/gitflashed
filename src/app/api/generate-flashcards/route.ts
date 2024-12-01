import { NextRequest, NextResponse } from 'next/server'
import { fetchGitHubData } from '@/lib/github'
import { generateAIInsights } from '@/lib/ai'
import { GitHubData } from '@/types'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const username = searchParams.get('username')

  if (!username) {
    return NextResponse.json({ error: 'Username is required' }, { status: 400 })
  }

  try {
    const githubData: GitHubData = await fetchGitHubData(username)
    const aiInsights = await generateAIInsights(githubData)

    // Convert AI insights to flashcards
    const flashcards = [
      {
        id: 'flashcard-1',
        title: 'Appreciation',
        content: aiInsights.appreciation,
      }
    ]

    return NextResponse.json(flashcards)
  } catch (error: unknown) {
    console.error('Error in generate-flashcards route:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    return NextResponse.json({ error: 'Failed to generate flashcards', details: errorMessage }, { status: 500 })
  }
}