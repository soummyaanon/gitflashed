import { NextRequest, NextResponse } from 'next/server'
import { fetchGitHubData } from '@/lib/github'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const username = searchParams.get('username')

  if (!username) {
    return NextResponse.json({ error: 'Username is required' }, { status: 400 })
  }

  try {
    const githubData = await fetchGitHubData(username)
    return NextResponse.json(githubData)
  } catch (error: unknown) {
    console.error('Error in github-dashboard route:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    return NextResponse.json({ error: 'Failed to fetch GitHub data', details: errorMessage }, { status: 500 })
  }
}