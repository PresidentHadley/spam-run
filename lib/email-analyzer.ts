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
  const prompt = `You are a STRICT email deliverability expert. You catch spam patterns that others miss.

Subject: ${subject}

Body:
${body}

RED FLAGS TO WATCH FOR:
- All-caps subject lines or excessive punctuation (!!!, @@@)
- Repeated URLs or text (like "spam.com spam.com spam.com")
- The word "SPAM" in subject/body (ironic but still a flag!)
- Excessive exclamation marks
- Missing unsubscribe links in marketing emails
- Too many links
- Overly promotional language

Be AGGRESSIVE in scoring. A subject like "SPAM!@!!" should be 70+ spam score.
Repeated URLs are a MASSIVE red flag (add 30+ points).

Provide analysis in this JSON format:
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
      "action": "SPECIFIC action to take (e.g., 'Add unsubscribe link', not vague terms like 'Add authentication elements')",
      "impact": "high" | "medium" | "low",
      "details": "specific guidance with examples - show before/after if major issues found"
    }
  ],
  "suggestedRewrite": "If spam score > 50, provide a complete rewritten version that fixes all issues while keeping the core message. Make it conversational, professional, and deliverable. If score < 50, leave this field empty."
}

Be harsh but fair. Real spam should score 70+.`

  try {
    if (!anthropic) {
      // Fallback if API key not configured
      console.log('⚠️ ANTHROPIC_API_KEY not configured - using fallback analysis')
      return fallbackAnalysis(subject, body, Date.now() - startTime)
    }

    console.log('✅ Using Claude AI for analysis')
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
        suggestedRewrite: analysis.suggestedRewrite || null,
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
  
  // Check if subject contains "spam" (ironic but still a red flag)
  if (/spam/i.test(subject)) {
    subjectLineIssues.push({
      type: 'spam_word',
      issue: 'Subject contains "SPAM"',
      recommendation: 'Never use the word "spam" in your subject line',
    })
    spamScore += 30
  }
  
  if (subject.length > 60) {
    subjectLineIssues.push({
      type: 'length',
      issue: 'Subject line is too long',
      recommendation: 'Keep subject lines under 60 characters for better open rates',
    })
    spamScore += 5
  }

  const capsCount = (subject.match(/[A-Z]/g) || []).length
  if (capsCount / subject.length > 0.5 && subject.length > 3) {
    subjectLineIssues.push({
      type: 'excessive_caps',
      issue: 'Too many capital letters in subject',
      recommendation: 'Use normal capitalization - all caps looks like spam',
    })
    spamScore += 25
  }
  
  // Check for special character spam (@@@, !!!)
  const specialChars = subject.match(/[@!#$%]{2,}/g)
  if (specialChars) {
    subjectLineIssues.push({
      type: 'excessive_punctuation',
      issue: `Excessive special characters: ${specialChars.join(', ')}`,
      recommendation: 'Remove excessive punctuation marks',
    })
    spamScore += 20
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
  
  // Check for repeated URLs/domains (HUGE spam indicator)
  const urlPattern = /(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9-]+\.[a-zA-Z]{2,})/gi
  const urls = body.match(urlPattern) || []
  const urlCounts: Record<string, number> = {}
  urls.forEach(url => {
    const domain = url.toLowerCase().replace(/^(?:https?:\/\/)?(?:www\.)?/, '')
    urlCounts[domain] = (urlCounts[domain] || 0) + 1
  })
  
  const repeatedUrls = Object.entries(urlCounts).filter(([_, count]) => count > 3)
  if (repeatedUrls.length > 0) {
    issues.push({
      type: 'critical',
      category: 'content',
      issue: `Repeated URLs detected: ${repeatedUrls.map(([url, count]) => `${url} (${count}x)`).join(', ')}`,
      explanation: 'Repeating the same URL multiple times is a classic spam tactic',
      recommendation: 'Mention your URL once or twice maximum',
      impact: 'high',
    })
    spamScore += 35  // HUGE penalty
  }

  // Check technical aspects
  // Check if this looks like a personal/reply email for context
  const isPersonalEmail = /hi |hey |hello |thanks|thank you|i hope|regards/i.test(body.substring(0, 200)) 
    && body.split(/\s+/).length < 150

  if (technical.hasUnsubscribeLink) {
    positives.push({
      aspect: 'Unsubscribe link present',
      description: 'Required for commercial emails and improves deliverability',
    })
  } else {
    issues.push({
      type: isPersonalEmail ? 'warning' : 'critical',
      category: 'technical',
      issue: isPersonalEmail ? 'No unsubscribe link (required for mass emails)' : 'No unsubscribe link found',
      explanation: isPersonalEmail 
        ? 'If sending to multiple recipients, CAN-SPAM Act requires unsubscribe link. Not needed for personal replies.'
        : 'Required by CAN-SPAM Act for all commercial/marketing emails',
      recommendation: isPersonalEmail 
        ? 'For mass emails: Add unsubscribe link. For personal emails: You\'re fine!'
        : 'Add a clear unsubscribe link at bottom of email',
      impact: isPersonalEmail ? 'medium' : 'high',
    })
    spamScore += isPersonalEmail ? 10 : 25  // Less penalty for personal emails
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

  // Add positives for well-written emails
  if (spamWords.length === 0) {
    positives.push({
      aspect: 'Clean, professional language',
      description: 'No spam trigger words detected - great conversational tone!',
    })
  }
  
  if (subject.length > 0 && subject.length <= 60 && capsCount / subject.length < 0.3) {
    positives.push({
      aspect: 'Well-crafted subject line',
      description: 'Good length and natural capitalization',
    })
  }
  
  if (technical.linkCount <= 3 && technical.linkCount > 0) {
    positives.push({
      aspect: 'Appropriate link usage',
      description: `${technical.linkCount} link${technical.linkCount > 1 ? 's' : ''} - not excessive`,
    })
  }
  
  if (exclamationCount <= 1) {
    positives.push({
      aspect: 'Professional tone',
      description: 'Minimal use of exclamation marks and emphasis',
    })
  }
  
  if (isPersonalEmail && spamWords.length === 0) {
    positives.push({
      aspect: 'Personal, authentic voice',
      description: 'Reads like a genuine one-on-one conversation',
    })
  }
  
  if (technical.wordCount > 30 && technical.wordCount < 200) {
    positives.push({
      aspect: 'Good length',
      description: 'Concise but substantial - ideal for email',
    })
  }

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
  
  // Check for repeated URLs and add to recommendations
  if (repeatedUrls.length > 0) {
    recommendations.push({
      priority: 1,
      action: 'Remove repeated URLs',
      impact: 'high' as const,
      details: `You repeated ${repeatedUrls.map(([url, count]) => `"${url}" ${count} times`).join(', ')}.\n\nSpam filters HATE this. Mention your URL once, maybe twice max.\n\nExample: "Check out SpamRun.com" (once) instead of listing it 5 times.`,
    })
  }
  
  // Check for all-caps words and add specific recommendation
  if (allCapsWords.length > 2) {
    recommendations.push({
      priority: 2,
      action: 'Fix all-caps words',
      impact: 'high' as const,
      details: `Found ${allCapsWords.length} all-caps words: ${allCapsWords.slice(0, 5).join(', ')}\n\nChange to normal case:\n${allCapsWords.slice(0, 3).map(w => `"${w}" → "${w.charAt(0) + w.slice(1).toLowerCase()}"`).join('\n')}`,
    })
  }
  
  // Only recommend auth elements if missing AND looks like bulk email
  if (!technical.hasUnsubscribeLink || !technical.hasPhysicalAddress) {
    const missing: string[] = []
    if (!technical.hasUnsubscribeLink) missing.push('unsubscribe link')
    if (!technical.hasPhysicalAddress) missing.push('physical address')
    
    // Check if this looks like a personal/reply email
    const isPersonalEmail = /hi |hey |hello |thanks|thank you|i hope|regards|following up|circling back/i.test(body.substring(0, 200)) 
      && body.split(/\s+/).length < 150
      && !body.toLowerCase().includes('unsubscribe') // If they mention unsubscribe, it's bulk
    
    // Skip this recommendation for personal emails - don't scare them!
    if (isPersonalEmail) {
      // Don't add any recommendation - personal emails don't need CAN-SPAM compliance
    } else {
      // This looks like a bulk/marketing email - CAN-SPAM applies
      const missingItems = missing.join(' and ')
      recommendations.push({
        priority: 7, // High priority for bulk emails
        action: `Add ${missingItems} (CAN-SPAM required)`,
        impact: 'high',
        details: `⚠️ Required by CAN-SPAM Act for commercial emails: ${missingItems}.\n\nAdd at the bottom:\n"Unsubscribe | Company Name, 123 Main St, City, ST 12345"\n\n✅ Not required for personal replies or transactional emails.`,
      })
    }
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
  
  // Sort recommendations by priority
  recommendations.sort((a, b) => a.priority - b.priority)

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

