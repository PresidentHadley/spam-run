'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AlertCircle, CheckCircle, TrendingUp, Zap, AlertTriangle } from 'lucide-react'

export default function EmailCheckerPage() {
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')

  const handleCheck = async () => {
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await fetch('/api/email-checker/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subject, body }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to analyze email')
      }

      const data = await response.json()
      setResult(data)
    } catch (err: any) {
      setError(err.message || 'Failed to analyze email')
    } finally {
      setLoading(false)
    }
  }

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case 'INBOX_READY':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'NEEDS_IMPROVEMENT':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'HIGH_RISK':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'SPAM_LIKELY':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    if (score >= 40) return 'text-orange-600'
    return 'text-red-600'
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Email Checker</h1>
        <p className="text-muted-foreground mt-1">
          Check your emails for spam triggers before sending
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle>Email Content</CardTitle>
            <CardDescription>
              Enter your email subject and body to analyze
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive flex items-start gap-2">
                <AlertCircle className="h-4 w-4 mt-0.5" />
                <span>{error}</span>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="subject">Subject Line</Label>
              <Input
                id="subject"
                placeholder="Your email subject..."
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                {subject.length} characters
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="body">Email Body</Label>
              <Textarea
                id="body"
                placeholder="Your email content..."
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={12}
              />
              <p className="text-xs text-muted-foreground">
                {body.split(/\s+/).filter(Boolean).length} words
              </p>
            </div>
            <Button
              onClick={handleCheck}
              disabled={loading || !subject || !body}
              className="w-full"
              size="lg"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2"></div>
                  Analyzing...
                </>
              ) : (
                <>
                  <Zap className="mr-2 h-4 w-4" />
                  Run Spam Check
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        <div>
          {result ? (
            <div className="space-y-6">
              {/* Score Cards */}
              <div className="grid gap-4 sm:grid-cols-3">
                <Card>
                  <CardContent className="pt-6 text-center">
                    <div className={`text-3xl font-bold ${getScoreColor(100 - result.spamScore)}`}>
                      {result.spamScore}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Spam Score</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 text-center">
                    <div className={`text-3xl font-bold ${getScoreColor(result.deliverabilityScore)}`}>
                      {result.deliverabilityScore}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Deliverability</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 text-center">
                    <div className={`text-3xl font-bold ${getScoreColor(result.estimatedInboxRate)}`}>
                      {result.estimatedInboxRate}%
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Inbox Rate</p>
                  </CardContent>
                </Card>
              </div>

              {/* Verdict */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Verdict:</span>
                    <Badge className={getVerdictColor(result.verdict)}>
                      {result.verdict?.replace(/_/g, ' ')}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Detailed Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle>Analysis Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="issues">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="issues">Issues</TabsTrigger>
                      <TabsTrigger value="recommendations">Fixes</TabsTrigger>
                      <TabsTrigger value="positives">Positives</TabsTrigger>
                    </TabsList>

                    <TabsContent value="issues" className="space-y-4 mt-4">
                      {result.analysis.spamIndicators?.length > 0 ? (
                        result.analysis.spamIndicators.map((indicator: any, idx: number) => (
                          <div key={idx} className="border-l-4 border-red-500 pl-4 py-2">
                            <div className="flex items-start gap-2">
                              <AlertTriangle className="h-4 w-4 text-red-600 mt-1" />
                              <div className="flex-1">
                                <p className="font-medium text-sm">{indicator.issue}</p>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {indicator.explanation}
                                </p>
                                <p className="text-sm text-primary mt-2">
                                  → {indicator.recommendation}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          No major issues found!
                        </p>
                      )}
                    </TabsContent>

                    <TabsContent value="recommendations" className="space-y-4 mt-4">
                      {result.analysis.recommendations?.length > 0 ? (
                        result.analysis.recommendations.map((rec: any, idx: number) => (
                          <div key={idx} className="border-l-4 border-blue-500 pl-4 py-2">
                            <div className="flex items-start gap-2">
                              <TrendingUp className="h-4 w-4 text-blue-600 mt-1" />
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <p className="font-medium text-sm">{rec.action}</p>
                                  <Badge variant="outline" className="text-xs">
                                    {rec.impact} impact
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {rec.details}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          No recommendations at this time
                        </p>
                      )}
                    </TabsContent>

                    <TabsContent value="positives" className="space-y-4 mt-4">
                      {result.analysis.positives?.length > 0 ? (
                        result.analysis.positives.map((positive: any, idx: number) => (
                          <div key={idx} className="border-l-4 border-green-500 pl-4 py-2">
                            <div className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-green-600 mt-1" />
                              <div className="flex-1">
                                <p className="font-medium text-sm">{positive.aspect}</p>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {positive.description}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          No positive signals detected
                        </p>
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="h-full">
              <CardContent className="flex items-center justify-center h-full min-h-[400px]">
                <div className="text-center text-muted-foreground">
                  <Zap className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p>Enter your email content and click "Run Spam Check" to see results</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

