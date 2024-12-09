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
            backgroundImage: 'linear-gradient(135deg, #111827 0%, #065f46 100%)',
            padding: '40px',
          }}
        >
          {/* Background Pattern */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: 'radial-gradient(circle at 25px 25px, rgba(255, 255, 255, 0.1) 2%, transparent 0%)',
              backgroundSize: '50px 50px',
            }}
          />

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              padding: '60px',
              borderRadius: '30px',
              border: '2px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
            }}
          >
            {/* User Avatar */}
            <img
              src={`https://github.com/${username}.png`}
              alt={username}
              width="160"
              height="160"
              style={{
                borderRadius: '80px',
                border: '4px solid rgba(255, 255, 255, 0.2)',
                marginBottom: '30px',
                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.3)',
              }}
            />

            {/* Title */}
            <div
              style={{
                fontSize: '48px',
                fontWeight: 'bold',
                color: 'white',
                marginBottom: '16px',
                textAlign: 'center',
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
              }}
            >
              {username}&apos;s Chill Score
            </div>

            {/* Subtitle */}
            <div
              style={{
                fontSize: '28px',
                color: 'rgba(255, 255, 255, 0.9)',
                marginBottom: '30px',
                textAlign: 'center',
                textShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
              }}
            >
              🧊 How chill is their code?
            </div>

            {/* Logo and Branding */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginTop: '20px',
              }}
            >
              <img 
                src="https://chillgits.vercel.app/95c.png" 
                width="40" 
                height="40" 
                alt="ChillGits"
                style={{
                  filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))',
                }}
              />
              <span
                style={{
                  fontSize: '24px',
                  color: 'rgba(255, 255, 255, 0.8)',
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
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
        headers: {
          'Cache-Control': 'public, max-age=3600',
          'Content-Type': 'image/png',
        },
      }
    )
  } catch (e) {
    console.error(e)
    return new Response('Failed to generate image', { status: 500 })
  }
} 