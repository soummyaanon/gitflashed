import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get('username');

    if (!username) {
      return new Response('Missing username parameter', { status: 400 });
    }

    // Fetch GitHub data for the user
    const response = await fetch(`https://api.github.com/users/${username}`);
    const userData = await response.json();

    // Fetch and prepare the avatar image
    const avatarResponse = await fetch(userData.avatar_url);
    const avatarArrayBuffer = await avatarResponse.arrayBuffer();
    const avatarBase64 = Buffer.from(avatarArrayBuffer).toString('base64');
    const avatarDataUrl = `data:image/jpeg;base64,${avatarBase64}`;

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
            backgroundColor: '#0f172a',
            padding: '40px 60px',
          }}
        >
          {/* Background gradient */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(135deg, rgba(34,197,94,0.1) 0%, rgba(0,0,0,0) 100%)',
              zIndex: 0,
            }}
          />

          {/* Content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1,
              width: '100%',
              padding: '40px',
            }}
          >
            {/* Avatar */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={avatarDataUrl}
              alt={username}
              style={{
                width: '140px',
                height: '140px',
                borderRadius: '70px',
                marginBottom: '24px',
                border: '6px solid rgba(34,197,94,0.5)',
                boxShadow: '0 0 30px rgba(34,197,94,0.3)',
              }}
            />

            {/* Username */}
            <h1
              style={{
                fontSize: '52px',
                fontWeight: 'bold',
                color: '#ffffff',
                marginBottom: '12px',
                textAlign: 'center',
                textShadow: '0 2px 10px rgba(34,197,94,0.3)',
              }}
            >
              {userData.name || username}
            </h1>

            {/* GitHub Stats */}
            <div
              style={{
                display: 'flex',
                gap: '24px',
                marginBottom: '24px',
                background: 'rgba(34,197,94,0.1)',
                padding: '12px 24px',
                borderRadius: '12px',
                border: '1px solid rgba(34,197,94,0.2)',
              }}
            >
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: '#22c55e', fontSize: '24px', fontWeight: 'bold' }}>
                  {userData.public_repos}
                </div>
                <div style={{ color: '#94a3b8', fontSize: '14px' }}>Repositories</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: '#22c55e', fontSize: '24px', fontWeight: 'bold' }}>
                  {userData.followers}
                </div>
                <div style={{ color: '#94a3b8', fontSize: '14px' }}>Followers</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: '#22c55e', fontSize: '24px', fontWeight: 'bold' }}>
                  {userData.following}
                </div>
                <div style={{ color: '#94a3b8', fontSize: '14px' }}>Following</div>
              </div>
            </div>

            {/* Description */}
            <p
              style={{
                fontSize: '28px',
                color: '#94a3b8',
                marginBottom: '30px',
                textAlign: 'center',
                maxWidth: '80%',
              }}
            >
              GitHub Dashboard on ChillGits
            </p>

            {/* Watermark */}
            <div
              style={{
                position: 'absolute',
                bottom: '20px',
                right: '20px',
                fontSize: '14px',
                color: 'rgba(148,163,184,0.5)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <img
                src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='rgba(148,163,184,0.5)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4'/%3E%3Cpath d='M9 18c-4.51 2-5-2-7-2'/%3E%3C/svg%3E"
                alt="GitHub Icon"
                style={{ width: '16px', height: '16px' }}
              />
              chillgits.vercel.app
            </div>
          </div>

          {/* Logo */}
          <div
            style={{
              position: 'absolute',
              bottom: '20px',
              right: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <p style={{ color: '#22c55e', fontSize: '24px', fontWeight: 'bold' }}>ChillGits</p>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e) {
    console.error(e);
    return new Response(`Failed to generate image`, { status: 500 });
  }
} 