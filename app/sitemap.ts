import { blogPosts } from '@/lib/blog-posts'

export default function sitemap() {
  const baseUrl = 'https://spamrun.com' // Update with your actual domain

  // Static pages
  const staticPages = [
    '',
    '/pricing',
    '/features',
    '/api-docs',
    '/blog',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: route === '' ? 'daily' : route === '/blog' ? 'daily' : 'weekly' as const,
    priority: route === '' ? 1 : route === '/pricing' ? 0.9 : 0.8,
  }))

  // Blog posts
  const blogPages = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.date,
    changeFrequency: 'weekly' as const,
    priority: post.featured ? 0.9 : 0.7,
  }))

  return [...staticPages, ...blogPages]
}

