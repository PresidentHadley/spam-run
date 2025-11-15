import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'SPAMRUN - Beat the Spam Filter'
export const size = {
  width: 1200,
  height: 600,
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
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            padding: '40px',
          }}
        >
          <div
            style={{
              fontSize: 64,
              fontWeight: 900,
              color: 'white',
              marginBottom: 20,
            }}
          >
            SPAMRUN
          </div>
          <div
            style={{
              fontSize: 36,
              fontWeight: 600,
              color: 'white',
              lineHeight: 1.3,
            }}
          >
            Beat the Spam Filter.
            <br />
            Reach the Inbox.
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}

