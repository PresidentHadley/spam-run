import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function ApiDocsPage() {
  return (
    <div className="container py-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold">API Documentation</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Integrate SPAMRUN email analysis into your application
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="auth">Authentication</TabsTrigger>
            <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
            <TabsTrigger value="examples">Examples</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Getting Started</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none">
                <p>
                  The SPAMRUN API allows you to programmatically check emails for spam triggers
                  and deliverability issues. Our REST API accepts JSON requests and returns
                  detailed analysis results.
                </p>
                <h3>Base URL</h3>
                <pre className="bg-muted p-4 rounded-lg">
                  https://api.spamrun.com/v1
                </pre>
                <h3>Rate Limits</h3>
                <ul>
                  <li>Free: Not available</li>
                  <li>Pro: 1,000 requests/month</li>
                  <li>Team: 10,000 requests/month</li>
                  <li>Enterprise: Unlimited</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="auth" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Authentication</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  All API requests require authentication using an API key. Include your API key
                  in the Authorization header:
                </p>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
{`Authorization: Bearer sr_live_abc123...`}
                </pre>
                <p className="text-sm text-muted-foreground">
                  You can generate API keys from your dashboard at{' '}
                  <a href="/dashboard/api-keys" className="text-primary hover:underline">
                    /dashboard/api-keys
                  </a>
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="endpoints" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>POST /email-checker/analyze</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>Analyze a single email for spam triggers and deliverability issues.</p>
                <h4 className="font-semibold">Request Body</h4>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`{
  "subject": "Your email subject line",
  "body": "Your email body content",
  "returnFullAnalysis": true
}`}
                </pre>
                <h4 className="font-semibold">Response</h4>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`{
  "id": "check_123abc",
  "spamScore": 35,
  "deliverabilityScore": 78,
  "estimatedInboxRate": 72,
  "verdict": "NEEDS_IMPROVEMENT",
  "analysis": {
    "subjectLineIssues": [...],
    "spamIndicators": [...],
    "recommendations": [...],
    "positives": [...]
  },
  "processingTimeMs": 1247,
  "timestamp": "2025-11-14T10:30:00Z"
}`}
                </pre>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>POST /email-checker/bulk</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>Analyze multiple emails in a single request (up to 100 emails).</p>
                <h4 className="font-semibold">Request Body</h4>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`{
  "emails": [
    {
      "id": "email_1",
      "subject": "Subject 1",
      "body": "Body 1"
    },
    {
      "id": "email_2",
      "subject": "Subject 2",
      "body": "Body 2"
    }
  ],
  "webhookUrl": "https://your-app.com/webhook"
}`}
                </pre>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="examples" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>cURL Example</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`curl -X POST https://api.spamrun.com/v1/email-checker/analyze \\
  -H "Authorization: Bearer sr_live_abc123..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "subject": "Your subject line",
    "body": "Your email body"
  }'`}
                </pre>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Node.js Example</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`const response = await fetch(
  'https://api.spamrun.com/v1/email-checker/analyze',
  {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer sr_live_abc123...',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      subject: 'Your subject line',
      body: 'Your email body'
    })
  }
);

const result = await response.json();
console.log(result);`}
                </pre>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Python Example</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`import requests

response = requests.post(
    'https://api.spamrun.com/v1/email-checker/analyze',
    headers={
        'Authorization': 'Bearer sr_live_abc123...',
        'Content-Type': 'application/json',
    },
    json={
        'subject': 'Your subject line',
        'body': 'Your email body'
    }
)

result = response.json()
print(result)`}
                </pre>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

