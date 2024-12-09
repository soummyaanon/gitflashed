import { ImageResponse } from '@vercel/og'
import { Redis } from '@upstash/redis'

export const runtime = 'edge'

const redis = new Redis({
  url: `https://${process.env.UPSTASH_REDIS_REST_URL}`,
  token: process.env.UPSTASH_REDIS_REST_TOKEN
})

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const username = searchParams.get('username')

    if (!username) {
      return new Response('Missing username', { status: 400 })
    }

    // Get user data from Redis or API
    const cacheKey = `github:${username}`
    const userData = await redis.get(cacheKey)

    if (!userData) {
      return new Response('User not found', { status: 404 })
    }

    // Create the OpenGraph image
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#111827',
            backgroundImage: 'linear-gradient(to bottom right, #111827, #065f46)',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(0,0,0,0.4)',
              padding: '40px 60px',
              borderRadius: '20px',
              border: '1px solid rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://github.com/${username}.png`}
              alt={username}
              width="120"
              height="120"
              style={{
                borderRadius: '60px',
                border: '2px solid rgba(255,255,255,0.2)',
                marginBottom: '20px',
              }}
            />
            <h1
              style={{
                fontSize: '48px',
                fontWeight: 'bold',
                color: 'white',
                marginBottom: '10px',
                textAlign: 'center',
              }}
            >
              {username}&apos;s Chill Score
            </h1>
            <p
              style={{
                fontSize: '24px',
                color: 'rgba(255,255,255,0.7)',
                marginBottom: '20px',
                textAlign: 'center',
              }}
            >
              Are they a chill developer?
            </p>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '20px',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://chillgits.vercel.app/95c.png" width="40" height="40" alt="ChillGits" />
              <span
                style={{
                  fontSize: '24px',
                  color: 'rgba(255,255,255,0.5)',
                }}
              >
                ChillGits
              </span>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (e) {
    console.error(e)
    return new Response('Failed to generate image', { status: 500 })
  }
} 