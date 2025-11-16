export interface EmailAnalysisRequest {
  subject: string
  body: string
  returnFullAnalysis?: boolean
  webhookUrl?: string
}

export interface SpamIndicator {
  type: 'critical' | 'warning' | 'info'
  category: 'content' | 'formatting' | 'links' | 'subject' | 'technical'
  issue: string
  explanation: string
  recommendation: string
  impact: 'high' | 'medium' | 'low'
}

export interface SubjectLineIssue {
  type: 'spam_word' | 'excessive_caps' | 'excessive_punctuation' | 'length' | 'misleading'
  issue: string
  recommendation: string
}

export interface Positive {
  aspect: string
  description: string
}

export interface Recommendation {
  priority: number
  action: string
  impact: 'high' | 'medium' | 'low'
  details: string
}

export interface EmailAnalysisResults {
  subjectLineIssues: SubjectLineIssue[]
  spamIndicators: SpamIndicator[]
  recommendations: Recommendation[]
  positives: Positive[]
  suggestedRewrite?: string | null
  technicalDetails?: {
    wordCount: number
    linkCount: number
    imageCount: number
    hasUnsubscribeLink: boolean
    hasPhysicalAddress: boolean
    htmlToTextRatio?: number
  }
}

export interface EmailAnalysisResponse {
  id: string
  spamScore: number
  deliverabilityScore: number
  estimatedInboxRate: number
  verdict: 'INBOX_READY' | 'NEEDS_IMPROVEMENT' | 'HIGH_RISK' | 'SPAM_LIKELY'
  analysis: EmailAnalysisResults
  processingTimeMs: number
  timestamp: string
}

export interface BulkEmailRequest {
  id: string
  subject: string
  body: string
}

export interface BulkAnalysisRequest {
  emails: BulkEmailRequest[]
  webhookUrl: string
  returnImmediately?: boolean
}

export interface BulkAnalysisResponse {
  batchId: string
  status: 'processing' | 'completed' | 'failed'
  totalEmails: number
  estimatedCompletionTime?: string
  webhookUrl?: string
  results?: Array<{
    id: string
    checkId: string
    spamScore: number
    verdict: string
    analysis?: EmailAnalysisResults
  }>
}

