import { NextRequest, NextResponse } from 'next/server'
import { fetchGitHubData } from '@/lib/github'
import { Redis } from '@upstash/redis'

const CACHE_TTL = 300 // 5 minutes

// Initialize Redis with proper error handling
let redis: Redis | null = null
try {
  if (process.env.REDIS_URL && process.env.REDIS_TOKEN) {
    redis = new Redis({
      url: `https://${process.env.REDIS_URL}`, 
      token: process.env.REDIS_TOKEN
    })
  }
} catch (error) {
  console.error('Redis initialization error:', error)
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const username = searchParams.get('username')
  const forceRefresh = searchParams.get('refresh') === 'true'

  if (!username) {
    return NextResponse.json({ error: 'Username is required' }, { status: 400 })
  }

  try {
    // Try to get cached data only if Redis is available and not forcing refresh
    if (redis && !forceRefresh) {
      try {
        const cachedData = await redis.get(`github:${username}`)
        if (cachedData && typeof cachedData === 'string') {
          try {
            const parsedData = JSON.parse(cachedData)
            if (parsedData && typeof parsedData === 'object') {
              return NextResponse.json(parsedData)
            }
          } catch (parseError) {
            console.error('Redis data parse error:', parseError)
            // Invalid JSON in cache, will fetch fresh data
          }
        }
      } catch (cacheError) {
        console.error('Redis cache error:', cacheError)
        // Continue with fresh data if cache fails
      }
    }

    // Fetch fresh data
    const githubData = await fetchGitHubData(username)
    
    // Try to cache the new data if Redis is available
    if (redis) {
      try {
        const dataToCache = JSON.stringify(githubData)
        await redis.set(`github:${username}`, dataToCache, {
          ex: CACHE_TTL
        })
      } catch (cacheError) {
        console.error('Redis cache set error:', cacheError)
        // Continue even if caching fails
      }
    }

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