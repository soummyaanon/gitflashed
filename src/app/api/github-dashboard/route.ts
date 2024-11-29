import { NextRequest, NextResponse } from 'next/server'
import { fetchGitHubData } from '@/lib/github'
import { Redis } from '@upstash/redis'

const CACHE_TTL = 3600 // 1 hour
const MAX_RECENT_ACTIVITIES = 3
const MAX_PINNED_REPOS = 6

const redis = new Redis({
  url: `https://${process.env.REDIS_URL}`,
  token: process.env.REDIS_TOKEN || ''
})

async function getOrSetCache(username: string, forceRefresh = false) {
  const cacheKey = `github:${username}`

  try {
    if (!forceRefresh) {
      const cachedData = await redis.get(cacheKey)
      if (cachedData) {
        return JSON.parse(cachedData as string)
      }
    }

    const githubData = await fetchGitHubData(username)
    
    // Optimize data before caching
    const optimizedData = {
      user: {
        login: githubData.user.login,
        name: githubData.user.name,
        avatar_url: githubData.user.avatar_url,
        bio: githubData.user.bio,
        followers: githubData.user.followers,
        following: githubData.user.following,
        public_repos: githubData.user.public_repos
      },
      pinnedRepos: githubData.pinnedRepos.slice(0, MAX_PINNED_REPOS),
      recentActivity: githubData.recentActivity.slice(0, MAX_RECENT_ACTIVITIES)
    }

    // Cache optimized data
    await redis.set(cacheKey, JSON.stringify(optimizedData), {
      ex: CACHE_TTL
    })

    return optimizedData
  } catch (error) {
    console.warn('Cache operation failed:', error)
    throw error
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const username = searchParams.get('username')
  const forceRefresh = searchParams.get('refresh') === 'true'

  if (!username) {
    return NextResponse.json(
      { error: 'Username is required' }, 
      { status: 400 }
    )
  }

  try {
    const data = await getOrSetCache(username, forceRefresh)
    return NextResponse.json(data)
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
    
    return NextResponse.json(
      { error: 'Failed to fetch GitHub data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}