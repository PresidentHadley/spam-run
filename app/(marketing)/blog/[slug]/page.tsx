import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getBlogPost, blogPosts } from '@/lib/blog-posts'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, ArrowLeft, ArrowRight } from 'lucide-react'
import { Card } from '@/components/ui/card'

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

// Blog post content (in real app, this would come from MDX files or CMS)
const blogContent: Record<string, JSX.Element> = {
  'why-emails-go-to-spam': (
    <>
      <p>Your email campaigns are ready. You hit send. But instead of flooding inboxes, your messages vanish into spam folders. Sound familiar?</p>
      
      <h2>The 12 Main Reasons Emails Go to Spam</h2>
      
      <h3>1. Spam Trigger Words</h3>
      <p>Words like "FREE", "ACT NOW", "CLICK HERE", and "MAKE MONEY" are red flags for spam filters. While these words alone won't doom your email, using multiple trigger words significantly increases your spam score.</p>
      
      <h3>2. Missing Unsubscribe Link</h3>
      <p>This is non-negotiable. The CAN-SPAM Act requires an easy way to opt-out. No unsubscribe link = automatic spam folder.</p>
      
      <h3>3. Poor Sender Reputation</h3>
      <p>ISPs track your sending history. If you've sent spam before, or if recipients frequently mark your emails as spam, your reputation suffers.</p>
      
      <h3>4. Missing Email Authentication</h3>
      <p>SPF, DKIM, and DMARC records prove you're actually who you say you are. Without them, you look like a scammer.</p>
      
      <h3>5. Purchased Email Lists</h3>
      <p>Buying email lists is a fast track to spam. These recipients never opted in, so they'll mark you as spam immediately.</p>
      
      <h3>6. Poor HTML/Text Ratio</h3>
      <p>All images, no text? That's a spam indicator. Aim for a healthy balance of text and images.</p>
      
      <h3>7. Misleading Subject Lines</h3>
      <p>If your subject line promises one thing and the email delivers another, spam filters notice. So do recipients who report you.</p>
      
      <h3>8. Too Many Links</h3>
      <p>More than 5 links can look suspicious. Keep it focused.</p>
      
      <h3>9. Sending Too Fast</h3>
      <p>Blasting 10,000 emails at once from a new domain screams "spammer." Warm up gradually.</p>
      
      <h3>10. No Physical Address</h3>
      <p>CAN-SPAM requires a physical mailing address. Missing this = spam.</p>
      
      <h3>11. Bad Engagement Rates</h3>
      <p>If nobody opens or clicks your emails, ISPs assume they're unwanted and start filtering them.</p>
      
      <h3>12. Inconsistent Sending Patterns</h3>
      <p>Sending sporadically or in huge bursts looks suspicious. Maintain a consistent schedule.</p>
      
      <h2>How to Fix It</h2>
      <p>The solution? Test your emails BEFORE sending. Use SPAMRUN to:</p>
      <ul>
        <li>Identify spam triggers in your content</li>
        <li>Get actionable recommendations</li>
        <li>Improve your deliverability score</li>
        <li>Reach the inbox, not spam</li>
      </ul>
      
      <p>Don't let your hard work end up in spam folders. Check your emails before sending.</p>
    </>
  ),
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
        <header className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Badge>{post.category}</Badge>
            {post.featured && <Badge variant="secondary">Featured</Badge>}
          </div>
          
          <h1 className="text-4xl font-bold tracking-tight mb-4">{post.title}</h1>
          
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
        <div className="prose prose-lg max-w-none">
          {blogContent[params.slug] || (
            <div>
              <p>{post.excerpt}</p>
              <p className="text-muted-foreground italic">Full article content coming soon...</p>
            </div>
          )}
        </div>

        {/* Tags */}
        <div className="mt-8 pt-8 border-t">
          <div className="flex flex-wrap gap-2">
            {post.tags.map(tag => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* CTA */}
        <Card className="mt-12 p-8 bg-gradient-to-r from-purple-50 to-blue-50 border-2">
          <h3 className="text-2xl font-bold mb-2">Ready to Improve Your Email Deliverability?</h3>
          <p className="text-muted-foreground mb-6">
            Check your emails for spam triggers before sending. Get instant analysis and actionable recommendations.
          </p>
          <Link href="/signup">
            <Button size="lg">Try SPAMRUN Free</Button>
          </Link>
        </Card>

        {/* Previous/Next navigation */}
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {previousPost && (
            <Link href={`/blog/${previousPost.slug}`}>
              <Card className="p-6 hover:border-primary transition-colors">
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
              <Card className="p-6 hover:border-primary transition-colors">
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

