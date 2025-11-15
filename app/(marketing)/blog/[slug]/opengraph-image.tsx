import { ImageResponse } from 'next/og'
import { getBlogPost } from '@/lib/blog-posts'

export const runtime = 'edge'

export const alt = 'SPAMRUN Blog Post'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image({ params }: { params: { slug: string } }) {
  const post = getBlogPost(params.slug)
  
  if (!post) {
    return new Response('Not found', { status: 404 })
  }

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: '60px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: 40,
          }}
        >
          <div
            style={{
              fontSize: 36,
              fontWeight: 900,
              color: 'white',
            }}
          >
            SPAMRUN
          </div>
          <div
            style={{
              marginLeft: 20,
              padding: '8px 16px',
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: 20,
              fontSize: 18,
              color: 'white',
              fontWeight: 600,
            }}
          >
            {post.category}
          </div>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 56,
            fontWeight: 700,
            color: 'white',
            lineHeight: 1.2,
            marginBottom: 30,
            maxWidth: 1000,
          }}
        >
          {post.title}
        </div>

        {/* Meta */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 30,
            fontSize: 22,
            color: 'rgba(255, 255, 255, 0.9)',
          }}
        >
          <div>{post.readTime}</div>
          <div>•</div>
          <div>{new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
        </div>

        {/* Bottom */}
        <div
          style={{
            position: 'absolute',
            bottom: 60,
            left: 60,
            right: 60,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: 30,
            borderTop: '2px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          <div
            style={{
              fontSize: 24,
              color: 'rgba(255, 255, 255, 0.9)',
              fontWeight: 600,
            }}
          >
            spamrun.com/blog
          </div>
          <div
            style={{
              fontSize: 20,
              color: 'rgba(255, 255, 255, 0.7)',
            }}
          >
            Email Deliverability Expert
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}

