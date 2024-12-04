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
            }}
          >
            {/* Avatar */}
            <img
              src={avatarDataUrl}
              alt={username}
              style={{
                width: '120px',
                height: '120px',
                borderRadius: '60px',
                marginBottom: '20px',
                border: '4px solid rgba(34,197,94,0.5)',
              }}
            />

            {/* Username */}
            <h1
              style={{
                fontSize: '48px',
                fontWeight: 'bold',
                color: '#ffffff',
                marginBottom: '10px',
                textAlign: 'center',
              }}
            >
              {userData.name || username}
            </h1>

            {/* Description */}
            <p
              style={{
                fontSize: '24px',
                color: '#94a3b8',
                marginBottom: '30px',
                textAlign: 'center',
              }}
            >
              GitHub Dashboard on ChillGits
            </p>

            {/* Stats */}
            <div
              style={{
                display: 'flex',
                gap: '40px',
                marginTop: '20px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <p style={{ color: '#22c55e', fontSize: '36px', fontWeight: 'bold' }}>
                  {userData.public_repos}
                </p>
                <p style={{ color: '#94a3b8', fontSize: '16px' }}>Repositories</p>
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <p style={{ color: '#22c55e', fontSize: '36px', fontWeight: 'bold' }}>
                  {userData.followers}
                </p>
                <p style={{ color: '#94a3b8', fontSize: '16px' }}>Followers</p>
              </div>
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