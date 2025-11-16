import Anthropic from '@anthropic-ai/sdk'
import type { EmailAnalysisResults, EmailAnalysisResponse } from '@/types/email-checker'

const anthropic = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    })
  : null

const SPAM_TRIGGER_WORDS = [
  'free', 'click here', 'act now', 'limited time', 'urgent', 'congratulations',
  'winner', 'prize', 'guarantee', 'no risk', 'order now', 'buy now',
  'call now', 'subscribe', 'money back', 'cash', 'income', 'earn',
  'credit', 'loan', 'debt', 'refinance', 'viagra', 'weight loss',
  '100% free', 'make money', 'work from home', 'be your own boss'
]

export async function analyzeEmail(
  subject: string,
  body: string
): Promise<EmailAnalysisResponse> {
  const startTime = Date.now()

  // Prepare the analysis prompt
  const prompt = `You are an expert email deliverability analyst. Analyze this email for spam triggers and deliverability issues.

Subject: ${subject}

Body:
${body}

Provide a comprehensive analysis in the following JSON format:
{
  "spamScore": <number 0-100>,
  "deliverabilityScore": <number 0-100>,
  "estimatedInboxRate": <number 0-100>,
  "verdict": "INBOX_READY" | "NEEDS_IMPROVEMENT" | "HIGH_RISK" | "SPAM_LIKELY",
  "subjectLineIssues": [
    {
      "type": "spam_word" | "excessive_caps" | "excessive_punctuation" | "length" | "misleading",
      "issue": "description",
      "recommendation": "how to fix"
    }
  ],
  "spamIndicators": [
    {
      "type": "critical" | "warning" | "info",
      "category": "content" | "formatting" | "links" | "subject" | "technical",
      "issue": "what's wrong",
      "explanation": "why it's a problem",
      "recommendation": "how to fix it",
      "impact": "high" | "medium" | "low"
    }
  ],
  "positives": [
    {
      "aspect": "what's good",
      "description": "why it helps"
    }
  ],
  "recommendations": [
    {
      "priority": <number 1-10>,
      "action": "what to do",
      "impact": "high" | "medium" | "low",
      "details": "specific guidance"
    }
  ]
}

Analysis criteria:
- Spam words and phrases
- Subject line quality (length, caps, punctuation, spam triggers)
- Email body content (promotional language, urgency tactics, deceptive claims)
- Link structure and quantity
- Image to text ratio (if applicable)
- Formatting (excessive caps, colors, fonts)
- Authentication signals (unsubscribe link, physical address)
- Overall professionalism and legitimacy

Be thorough and specific. Focus on actionable recommendations.`

  try {
    if (!anthropic) {
      // Fallback if API key not configured
      return fallbackAnalysis(subject, body, Date.now() - startTime)
    }

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4096,
      temperature: 0.3,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    })

    const responseText = message.content[0].type === 'text' ? message.content[0].text : ''
    
    // Extract JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('Failed to parse AI response')
    }

    const analysis = JSON.parse(jsonMatch[0])
    const processingTime = Date.now() - startTime

    return {
      id: `check_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      spamScore: analysis.spamScore,
      deliverabilityScore: analysis.deliverabilityScore,
      estimatedInboxRate: analysis.estimatedInboxRate,
      verdict: analysis.verdict,
      analysis: {
        subjectLineIssues: analysis.subjectLineIssues || [],
        spamIndicators: analysis.spamIndicators || [],
        recommendations: analysis.recommendations || [],
        positives: analysis.positives || [],
        technicalDetails: analyzeTechnical(subject, body),
      },
      processingTimeMs: processingTime,
      timestamp: new Date().toISOString(),
    }
  } catch (error) {
    console.error('Error analyzing email:', error)
    
    // Fallback to rule-based analysis
    return fallbackAnalysis(subject, body, Date.now() - startTime)
  }
}

function extractContext(text: string, word: string, contextLength: number = 50): string {
  const lowerText = text.toLowerCase()
  const lowerWord = word.toLowerCase()
  const index = lowerText.indexOf(lowerWord)
  
  if (index === -1) return word
  
  const start = Math.max(0, index - contextLength)
  const end = Math.min(text.length, index + word.length + contextLength)
  
  let context = text.substring(start, end)
  if (start > 0) context = '...' + context
  if (end < text.length) context = context + '...'
  
  return context
}

function analyzeTechnical(subject: string, body: string) {
  const words = body.split(/\s+/).length
  const linkMatches = body.match(/https?:\/\/[^\s]+/g)
  const linkCount = linkMatches ? linkMatches.length : 0
  const imageMatches = body.match(/<img[^>]*>/gi)
  const imageCount = imageMatches ? imageMatches.length : 0
  const hasUnsubscribeLink = /unsubscribe|opt-out|opt out/i.test(body)
  const hasPhysicalAddress = /\d+\s+[\w\s]+,\s*[\w\s]+,\s*[A-Z]{2}\s+\d{5}/i.test(body)

  return {
    wordCount: words,
    linkCount,
    imageCount,
    hasUnsubscribeLink,
    hasPhysicalAddress,
  }
}

function fallbackAnalysis(
  subject: string,
  body: string,
  processingTime: number
): EmailAnalysisResponse {
  const issues: any[] = []
  let spamScore = 0
  const positives: any[] = []

  // Check subject line
  const subjectLineIssues: any[] = []
  
  if (subject.length > 60) {
    subjectLineIssues.push({
      type: 'length',
      issue: 'Subject line is too long',
      recommendation: 'Keep subject lines under 60 characters for better open rates',
    })
    spamScore += 5
  }

  const capsCount = (subject.match(/[A-Z]/g) || []).length
  if (capsCount / subject.length > 0.5) {
    subjectLineIssues.push({
      type: 'excessive_caps',
      issue: 'Too many capital letters in subject',
      recommendation: 'Use normal capitalization',
    })
    spamScore += 20  // Increased from 10 to 20
  }
  
  // Check for excessive exclamation marks
  const exclamationCount = (subject.match(/!/g) || []).length + (body.match(/!/g) || []).length
  if (exclamationCount >= 3) {
    issues.push({
      type: 'warning',
      category: 'formatting',
      issue: `Excessive exclamation marks (${exclamationCount} found)`,
      explanation: 'Multiple exclamation marks are a common spam indicator',
      recommendation: 'Use at most one exclamation mark',
      impact: 'medium',
    })
    spamScore += 15
  }
  
  // Check for all caps words in body
  const allCapsWords = body.match(/\b[A-Z]{3,}\b/g) || []
  if (allCapsWords.length > 2) {
    issues.push({
      type: 'warning',
      category: 'formatting',
      issue: `Multiple all-caps words (${allCapsWords.length} found)`,
      explanation: 'Excessive capitalization is unprofessional and spam-like',
      recommendation: 'Use normal sentence case',
      impact: 'medium',
    })
    spamScore += 12
  }

  // Check for spam words
  const lowerSubject = subject.toLowerCase()
  const lowerBody = body.toLowerCase()
  const spamWords = SPAM_TRIGGER_WORDS.filter(
    word => lowerSubject.includes(word) || lowerBody.includes(word)
  )

  if (spamWords.length > 0) {
    issues.push({
      type: 'critical',
      category: 'content',
      issue: `Contains spam trigger words: ${spamWords.slice(0, 3).join(', ')}${spamWords.length > 3 ? ` and ${spamWords.length - 3} more` : ''}`,
      explanation: 'These words are commonly associated with spam emails',
      recommendation: 'Replace or remove these phrases with more natural language',
      impact: 'high',
    })
    spamScore += spamWords.length * 15  // Increased from 8 to 15
  }

  const technical = analyzeTechnical(subject, body)

  // Check technical aspects
  if (technical.hasUnsubscribeLink) {
    positives.push({
      aspect: 'Unsubscribe link present',
      description: 'Required for commercial emails and improves deliverability',
    })
  } else {
    issues.push({
      type: 'critical',
      category: 'technical',
      issue: 'No unsubscribe link found',
      explanation: 'Required by CAN-SPAM Act for marketing emails',
      recommendation: 'Add a clear unsubscribe link',
      impact: 'high',
    })
    spamScore += 25  // Increased from 15 to 25
  }

  if (technical.linkCount > 5) {
    issues.push({
      type: 'warning',
      category: 'links',
      issue: 'Too many links in email',
      explanation: 'Excessive links are a common spam indicator',
      recommendation: 'Reduce to 2-3 essential links',
      impact: 'medium',
    })
    spamScore += 18  // Increased from 10 to 18
  }
  
  // Check for phone numbers (common in spam)
  const phonePattern = /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g
  const phones = body.match(phonePattern) || []
  if (phones.length > 0) {
    issues.push({
      type: 'warning',
      category: 'content',
      issue: 'Contains phone number',
      explanation: 'Phone numbers in emails can be a spam indicator',
      recommendation: 'Consider removing or using a contact form instead',
      impact: 'low',
    })
    spamScore += 8
  }

  // Cap spam score at 100
  spamScore = Math.min(spamScore, 100)
  const deliverabilityScore = Math.max(0, 100 - spamScore)
  const estimatedInboxRate = Math.max(0, deliverabilityScore - 10)

  let verdict: 'INBOX_READY' | 'NEEDS_IMPROVEMENT' | 'HIGH_RISK' | 'SPAM_LIKELY'
  if (spamScore < 20) verdict = 'INBOX_READY'
  else if (spamScore < 50) verdict = 'NEEDS_IMPROVEMENT'
  else if (spamScore < 75) verdict = 'HIGH_RISK'
  else verdict = 'SPAM_LIKELY'

  // Build dynamic recommendations based on actual issues
  const recommendations: any[] = []
  
  // Only recommend removing spam words if they actually exist
  if (spamWords.length > 0) {
    const examples = spamWords.slice(0, 3).map(word => {
      const context = extractContext(body, word)
      return `"${context}" → Remove or reword this phrase`
    }).join('\n')
    
    recommendations.push({
      priority: 1,
      action: 'Remove spam trigger words',
      impact: 'high' as const,
      details: `Found: ${spamWords.join(', ')}.\n\n${examples}`,
    })
  }
  
  // Only recommend auth elements if missing
  if (!technical.hasUnsubscribeLink || !technical.hasPhysicalAddress) {
    const missing: string[] = []
    if (!technical.hasUnsubscribeLink) missing.push('unsubscribe link')
    if (!technical.hasPhysicalAddress) missing.push('physical address')
    
    recommendations.push({
      priority: 2,
      action: 'Add authentication elements',
      impact: 'high' as const,
      details: `Missing: ${missing.join(' and ')}. Add at the bottom:\n\n"Unsubscribe | Company Name, 123 Main St, City, ST 12345"`,
    })
  }
  
  // Only recommend subject optimization if there are issues
  if (subjectLineIssues.length > 0) {
    const subjectIssueList = subjectLineIssues.map(i => i.issue).join(', ')
    let betterSubject = subject
    
    // Suggest actual improvements
    if (capsCount / subject.length > 0.5) {
      betterSubject = subject.toLowerCase().replace(/^\w/, c => c.toUpperCase())
    }
    if (subject.length > 60) {
      betterSubject = betterSubject.substring(0, 57) + '...'
    }
    
    recommendations.push({
      priority: 3,
      action: 'Optimize subject line',
      impact: 'medium' as const,
      details: `Current: "${subject}"\nIssues: ${subjectIssueList}\n\nTry: "${betterSubject}"`,
    })
  }
  
  // Add recommendations for excessive caps/exclamations
  if (exclamationCount >= 3 || allCapsWords.length > 2) {
    const examples: string[] = []
    if (exclamationCount >= 3) examples.push(`Remove ${exclamationCount - 1} exclamation marks`)
    if (allCapsWords.length > 2) examples.push(`Change "${allCapsWords.slice(0, 2).join(', ')}" to normal case`)
    
    recommendations.push({
      priority: 4,
      action: 'Reduce emphasis formatting',
      impact: 'medium' as const,
      details: examples.join('\n'),
    })
  }
  
  // Only show if user has good tone but missing technical stuff
  if (spamWords.length === 0 && technical.hasUnsubscribeLink && positives.length > 0) {
    recommendations.push({
      priority: 5,
      action: 'Your tone is great!',
      impact: 'low' as const,
      details: 'Keep the conversational style. Focus on technical requirements only.',
    })
  }

  return {
    id: `check_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    spamScore,
    deliverabilityScore,
    estimatedInboxRate,
    verdict,
    analysis: {
      subjectLineIssues,
      spamIndicators: issues,
      recommendations,
      positives,
      technicalDetails: technical,
    },
    processingTimeMs: processingTime,
    timestamp: new Date().toISOString(),
  }
}

