import { Redis } from '@upstash/redis'
import { NextResponse } from 'next/server'

// Initialize Redis with proper error handling
let redis: Redis | null = null

try {
  redis = new Redis({
    url: `https://${process.env.UPSTASH_REDIS_REST_URL}`,
    token: process.env.UPSTASH_REDIS_REST_TOKEN
  })
} catch (error) {
  console.error('Redis initialization error:', error)
}

const USER_COUNT_KEY = 'chillgits:user_count'

export async function GET() {
  try {
    if (!redis) { 
      throw new Error('Redis not initialized')
    }
    const count = await redis.get(USER_COUNT_KEY) || '0'
    return NextResponse.json({ count: parseInt(count as string) })
  } catch (error) {
    console.error('Error getting user count:', error)
    return NextResponse.json({ count: 0 })
  }
}

export async function POST() {
  try {
    if (!redis) {
      throw new Error('Redis not initialized')
    }
    const count = await redis.incr(USER_COUNT_KEY)
    return NextResponse.json({ count })
  } catch (error) {
    console.error('Error incrementing user count:', error)
    return NextResponse.json({ count: 0 })
  }
} 