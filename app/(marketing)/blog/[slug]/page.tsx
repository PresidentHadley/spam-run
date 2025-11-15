import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getBlogPost, blogPosts } from '@/lib/blog-posts'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, ArrowLeft, ArrowRight } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { blogContent } from '@/lib/blog-content'

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = getBlogPost(params.slug)
  
  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  return {
    title: `${post.title} | SPAMRUN Blog`,
    description: post.excerpt,
    keywords: post.tags.join(', '),
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
    },
  }
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getBlogPost(params.slug)
  
  if (!post) {
    notFound()
  }

  const currentIndex = blogPosts.findIndex(p => p.slug === params.slug)
  const previousPost = currentIndex > 0 ? blogPosts[currentIndex - 1] : null
  const nextPost = currentIndex < blogPosts.length - 1 ? blogPosts[currentIndex + 1] : null

  return (
    <div className="container py-12">
      <article className="mx-auto max-w-3xl">
        {/* Back to blog */}
        <Link href="/blog" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to blog
        </Link>

        {/* Post header */}
        <header className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Badge>{post.category}</Badge>
            {post.featured && <Badge variant="secondary">Featured</Badge>}
          </div>
          
          <h1 className="text-4xl font-bold tracking-tight mb-6 leading-tight">{post.title}</h1>
          
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {new Date(post.date).toLocaleDateString('en-US', { 
                month: 'long', 
                day: 'numeric', 
                year: 'numeric' 
              })}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {post.readTime}
            </div>
            <div>By {post.author}</div>
          </div>
        </header>

        {/* Post content */}
        <div className="prose max-w-none">
          {blogContent[params.slug] || (
            <div>
              <p>{post.excerpt}</p>
              <p className="text-muted-foreground italic mt-8">Full article content coming soon...</p>
            </div>
          )}
        </div>

        {/* Tags */}
        <div className="mt-12 pt-8 border-t">
          <div className="flex flex-wrap gap-2">
            {post.tags.map(tag => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* CTA */}
        <Card className="mt-12 p-8 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 border-2">
          <h3 className="text-2xl font-bold mb-2">Ready to Stop Landing in Spam?</h3>
          <p className="text-muted-foreground mb-6">
            Check your emails for spam triggers before sending. Get instant AI-powered analysis and actionable recommendations. Start with 3 free checks—no credit card required.
          </p>
          <Link href="/signup">
            <Button size="lg" className="text-lg px-8">Try SPAMRUN Free</Button>
          </Link>
        </Card>

        {/* Previous/Next navigation */}
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {previousPost && (
            <Link href={`/blog/${previousPost.slug}`}>
              <Card className="p-6 hover:border-primary transition-colors h-full">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <ArrowLeft className="h-4 w-4" />
                  Previous Article
                </div>
                <h4 className="font-semibold">{previousPost.title}</h4>
              </Card>
            </Link>
          )}
          {nextPost && (
            <Link href={`/blog/${nextPost.slug}`} className={previousPost ? '' : 'md:col-start-2'}>
              <Card className="p-6 hover:border-primary transition-colors h-full">
                <div className="flex items-center justify-end gap-2 text-sm text-muted-foreground mb-2">
                  Next Article
                  <ArrowRight className="h-4 w-4" />
                </div>
                <h4 className="font-semibold text-right">{nextPost.title}</h4>
              </Card>
            </Link>
          )}
        </div>
      </article>
    </div>
  )
}
