export const blogPosts = [
  {
    slug: 'why-emails-go-to-spam',
    title: 'Why Do My Emails Go to Spam? 12 Common Reasons (And How to Fix Them)',
    excerpt: 'Learn the top reasons emails end up in spam folders and actionable steps to improve your email deliverability.',
    author: 'SPAMRUN Team',
    date: '2025-11-14',
    readTime: '8 min read',
    category: 'Deliverability',
    tags: ['spam', 'deliverability', 'email marketing'],
    featured: true,
  },
  {
    slug: 'email-spam-trigger-words',
    title: 'Email Spam Trigger Words: Complete List of 200+ Words to Avoid in 2025',
    excerpt: 'Comprehensive list of spam trigger words that will land your emails in junk folders, plus alternatives to use instead.',
    author: 'SPAMRUN Team',
    date: '2025-11-13',
    readTime: '12 min read',
    category: 'Best Practices',
    tags: ['spam words', 'email content', 'best practices'],
    featured: true,
  },
  {
    slug: 'improve-email-deliverability',
    title: 'How to Improve Email Deliverability: 15 Proven Strategies That Work',
    excerpt: 'Master email deliverability with these battle-tested strategies used by top marketers to reach the inbox.',
    author: 'SPAMRUN Team',
    date: '2025-11-12',
    readTime: '10 min read',
    category: 'Guides',
    tags: ['deliverability', 'email marketing', 'strategy'],
    featured: true,
  },
  {
    slug: 'cold-email-spam-score',
    title: 'Cold Email Spam Score: How to Check Before Hitting Send',
    excerpt: 'Learn how to test your cold emails for spam before sending to maximize inbox placement and response rates.',
    author: 'SPAMRUN Team',
    date: '2025-11-11',
    readTime: '7 min read',
    category: 'Sales',
    tags: ['cold email', 'sales', 'prospecting'],
    featured: false,
  },
  {
    slug: 'email-authentication-spf-dkim-dmarc',
    title: 'Email Authentication Explained: SPF, DKIM, and DMARC Setup Guide',
    excerpt: 'Complete guide to setting up email authentication to prevent your emails from being marked as spam.',
    author: 'SPAMRUN Team',
    date: '2025-11-10',
    readTime: '15 min read',
    category: 'Technical',
    tags: ['authentication', 'SPF', 'DKIM', 'DMARC'],
    featured: false,
  },
  {
    slug: 'can-spam-compliance',
    title: 'CAN-SPAM Act Compliance: Everything You Need to Know in 2025',
    excerpt: 'Stay compliant with email marketing laws and avoid hefty fines with this comprehensive CAN-SPAM guide.',
    author: 'SPAMRUN Team',
    date: '2025-11-09',
    readTime: '9 min read',
    category: 'Compliance',
    tags: ['compliance', 'legal', 'regulations'],
    featured: false,
  },
  {
    slug: 'email-subject-line-best-practices',
    title: 'Email Subject Line Best Practices: How to Write Subject Lines That Get Opened',
    excerpt: 'Master the art of writing compelling subject lines that increase open rates and avoid spam filters.',
    author: 'SPAMRUN Team',
    date: '2025-11-08',
    readTime: '6 min read',
    category: 'Best Practices',
    tags: ['subject lines', 'open rates', 'copywriting'],
    featured: false,
  },
  {
    slug: 'gmail-spam-filter',
    title: 'How Gmail\'s Spam Filter Works (And How to Beat It)',
    excerpt: 'Inside look at Gmail\'s spam filtering algorithm and proven tactics to reach Gmail inboxes.',
    author: 'SPAMRUN Team',
    date: '2025-11-07',
    readTime: '11 min read',
    category: 'Technical',
    tags: ['gmail', 'spam filter', 'algorithm'],
    featured: false,
  },
  {
    slug: 'email-warm-up-guide',
    title: 'Email Warm-up Guide: How to Build Sender Reputation',
    excerpt: 'Step-by-step guide to warming up new email domains and maintaining strong sender reputation.',
    author: 'SPAMRUN Team',
    date: '2025-11-06',
    readTime: '8 min read',
    category: 'Guides',
    tags: ['warm-up', 'sender reputation', 'new domain'],
    featured: false,
  },
  {
    slug: 'email-marketing-metrics',
    title: 'Email Marketing Metrics That Matter: Beyond Open Rates',
    excerpt: 'Learn which email metrics actually predict success and how to optimize for inbox placement.',
    author: 'SPAMRUN Team',
    date: '2025-11-05',
    readTime: '7 min read',
    category: 'Analytics',
    tags: ['metrics', 'analytics', 'KPIs'],
    featured: false,
  },
]

export function getBlogPost(slug: string) {
  return blogPosts.find(post => post.slug === slug)
}

export function getFeaturedPosts() {
  return blogPosts.filter(post => post.featured)
}

export function getPostsByCategory(category: string) {
  return blogPosts.filter(post => post.category === category)
}

