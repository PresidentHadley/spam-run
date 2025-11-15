import Link from 'next/link'
import { blogPosts } from '@/lib/blog-posts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock } from 'lucide-react'

export const metadata = {
  title: 'Email Deliverability Blog | SPAMRUN',
  description: 'Expert guides, tips, and strategies to improve email deliverability and avoid spam filters.',
  keywords: 'email deliverability, spam filter, email marketing, cold email, inbox placement',
}

export default function BlogPage() {
  const featuredPosts = blogPosts.filter(p => p.featured)
  const regularPosts = blogPosts.filter(p => !p.featured)

  return (
    <div className="container py-12">
      {/* Header */}
      <div className="mx-auto max-w-4xl text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
          Email Deliverability Blog
        </h1>
        <p className="text-xl text-muted-foreground">
          Expert guides and insights to help you reach the inbox, not the spam folder
        </p>
      </div>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Featured Articles</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {featuredPosts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`}>
                <Card className="h-full hover:border-primary transition-colors cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge>{post.category}</Badge>
                    </div>
                    <CardTitle className="text-xl hover:text-primary transition-colors">
                      {post.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-4">
                      {post.excerpt}
                    </CardDescription>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(post.date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {post.readTime}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* All Posts */}
      <div>
        <h2 className="text-2xl font-bold mb-6">All Articles</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {regularPosts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}>
              <Card className="h-full hover:border-primary transition-colors cursor-pointer">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">{post.category}</Badge>
                  </div>
                  <CardTitle className="text-lg hover:text-primary transition-colors">
                    {post.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4">
                    {post.excerpt}
                  </CardDescription>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(post.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {post.readTime}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="mt-16 p-8 bg-muted rounded-lg">
        <h3 className="text-xl font-bold mb-4">Browse by Category</h3>
        <div className="flex flex-wrap gap-2">
          {Array.from(new Set(blogPosts.map(p => p.category))).map(category => (
            <Badge key={category} variant="secondary" className="text-sm py-1 px-3">
              {category}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  )
}

