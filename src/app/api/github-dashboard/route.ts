import { NextRequest, NextResponse } from 'next/server'
import { fetchGitHubData } from '@/lib/github'
import { Redis } from '@upstash/redis'

const CACHE_TTL = 300 // 5 minutes

// Initialize Redis with proper URL formatting
const redis = new Redis({
  url: `https://${process.env.REDIS_URL}`,
  token: process.env.REDIS_TOKEN || ''
})

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const username = searchParams.get('username')
  const forceRefresh = searchParams.get('refresh') === 'true'

  if (!username) {
    return NextResponse.json({ error: 'Username is required' }, { status: 400 })
  }

  try {
    // Try to get cached data first
    if (!forceRefresh) {
      const cachedData = await redis.get(`github:${username}`)
      if (cachedData) {
        return NextResponse.json(JSON.parse(cachedData as string))
      }
    }

    // Fetch fresh data if no cache or force refresh
    const githubData = await fetchGitHubData(username)
    
    // Cache the new data
    await redis.set(`github:${username}`, JSON.stringify(githubData), {
      ex: CACHE_TTL
    })

    return NextResponse.json(githubData)
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message.includes('rate limit')) {
        return NextResponse.json(
          { error: 'GitHub API rate limit exceeded', details: error.message },
          { status: 429 }
        )
      }
      if (error.message.includes('not found')) {
        return NextResponse.json(
          { error: 'GitHub user not found', username },
          { status: 404 }
        )
      }
    }
    
    console.error('Error in github-dashboard route:', error)
    return NextResponse.json(
      { error: 'Failed to fetch GitHub data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}