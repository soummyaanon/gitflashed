import { NextRequest, NextResponse } from 'next/server'
import { fetchGitHubData } from '@/lib/github'
import { generateFlashcards } from '@/lib/ai'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const username = searchParams.get('username')

  if (!username) {
    return NextResponse.json({ error: 'Username is required' }, { status: 400 })
  }

  try {
    console.log('Fetching GitHub data for:', username)
    const githubData = await fetchGitHubData(username)
    console.log('GitHub data fetched successfully')

    console.log('Generating flashcards')
    const flashcards = await generateFlashcards(githubData)
    console.log('Flashcards generated successfully')

    return NextResponse.json(flashcards)
  } catch (error) {
    console.error('Error in generate-flashcards route:', error)
    return NextResponse.json({ error: 'Failed to generate flashcards', details: (error as Error).message }, { status: 500 })
  }
}