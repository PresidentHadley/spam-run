import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'SPAMRUN - Beat the Spam Filter. Reach the Inbox.'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          position: 'relative',
        }}
      >
        {/* Background pattern */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.1,
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '30px 30px',
          }}
        />

        {/* Main content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '60px',
            textAlign: 'center',
            zIndex: 1,
          }}
        >
          {/* Logo/Brand */}
          <div
            style={{
              fontSize: 72,
              fontWeight: 900,
              color: 'white',
              marginBottom: 20,
              letterSpacing: '-0.02em',
            }}
          >
            SPAMRUN
          </div>

          {/* Tagline */}
          <div
            style={{
              fontSize: 48,
              fontWeight: 700,
              color: 'white',
              marginBottom: 30,
              lineHeight: 1.2,
              maxWidth: 900,
            }}
          >
            Beat the Spam Filter.
            <br />
            Reach the Inbox.
          </div>

          {/* Description */}
          <div
            style={{
              fontSize: 28,
              color: 'rgba(255, 255, 255, 0.9)',
              maxWidth: 800,
              lineHeight: 1.4,
            }}
          >
            AI-powered email analysis that tells you exactly why your emails land in spam—and how to fix it.
          </div>

          {/* Badge */}
          <div
            style={{
              marginTop: 40,
              display: 'flex',
              alignItems: 'center',
              gap: 20,
            }}
          >
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                padding: '12px 30px',
                borderRadius: 50,
                fontSize: 24,
                color: 'white',
                fontWeight: 600,
                border: '2px solid rgba(255, 255, 255, 0.3)',
              }}
            >
              ✓ Free checks available
            </div>
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                padding: '12px 30px',
                borderRadius: 50,
                fontSize: 24,
                color: 'white',
                fontWeight: 600,
                border: '2px solid rgba(255, 255, 255, 0.3)',
              }}
            >
              ✓ API access
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '30px 60px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'rgba(0, 0, 0, 0.2)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <div
            style={{
              fontSize: 24,
              color: 'rgba(255, 255, 255, 0.9)',
              fontWeight: 600,
            }}
          >
            spamrun.com
          </div>
          <div
            style={{
              fontSize: 20,
              color: 'rgba(255, 255, 255, 0.7)',
            }}
          >
            Start checking your emails today
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}

