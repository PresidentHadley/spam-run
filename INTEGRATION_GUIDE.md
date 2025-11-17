# SpamRun API Integration Guide

## Overview
This guide will help you integrate the SpamRun email analysis API into any application. SpamRun analyzes emails for spam triggers, deliverability issues, and provides AI-powered recommendations to improve inbox placement.

---

## Step 1: Get Your API Key

1. Go to **https://spamrun.com** and create an account (or log in)
2. Navigate to **Dashboard → API Keys** at https://spamrun.com/dashboard/api-keys
3. Click **"Create New API Key"**
4. Give it a descriptive name (e.g., "My App Integration")
5. **IMPORTANT**: Copy the API key immediately - it will only be shown once!
   - Format: `sr_live_abc123def456...`

---

## Step 2: API Endpoint Details

### Base Information
- **Base URL**: `https://spamrun.com`
- **Endpoint**: `/api/email-checker/analyze`
- **Method**: `POST`
- **Content-Type**: `application/json`

### Authentication
Include your API key in the Authorization header:
```
Authorization: Bearer sr_live_abc123def456...
```

### Rate Limits
- **Starter Plan**: 100 checks/month
- **Pro Plan**: 1,000 checks/month  
- **Enterprise Plan**: 100,000 checks/month

---

## Step 3: Request Format

### Required Fields
```json
{
  "subject": "Your email subject line",
  "body": "Your email body content"
}
```

### Example Request
```bash
curl -X POST https://spamrun.com/api/email-checker/analyze \
  -H "Authorization: Bearer sr_live_abc123def456..." \
  -H "Content-Type: application/json" \
  -d '{
    "subject": "Special Offer: 50% Off Today!",
    "body": "Hi there!\n\nWe have an amazing offer just for you. Click here to claim your discount before it expires!\n\nBest regards,\nThe Team"
  }'
```

---

## Step 4: Response Format

### Success Response (200 OK)
```json
{
  "id": "check_1731717600123_abc123",
  "spamScore": 45,
  "deliverabilityScore": 65,
  "estimatedInboxRate": 58,
  "verdict": "NEEDS_IMPROVEMENT",
  "analysis": {
    "subjectLineIssues": [
      {
        "type": "spam_word",
        "issue": "Contains spam trigger words: 'special offer', '50% off'",
        "recommendation": "Use softer language like 'limited-time discount' or focus on value"
      }
    ],
    "spamIndicators": [
      {
        "type": "warning",
        "category": "content",
        "issue": "Generic greeting ('Hi there!')",
        "explanation": "Personalization helps deliverability",
        "recommendation": "Use recipient's first name if available",
        "impact": "medium"
      },
      {
        "type": "critical",
        "category": "links",
        "issue": "No unsubscribe link found",
        "explanation": "Required by CAN-SPAM Act for marketing emails",
        "recommendation": "Add unsubscribe link at the bottom for bulk emails",
        "impact": "high"
      }
    ],
    "recommendations": [
      {
        "priority": 8,
        "action": "Replace spam trigger words",
        "impact": "high",
        "details": "Change 'Special Offer: 50% Off' to something like 'Limited Time: Save on [Product]'"
      },
      {
        "priority": 7,
        "action": "Add authentication elements",
        "impact": "high",
        "details": "For bulk emails, include: unsubscribe link and physical address at bottom"
      }
    ],
    "positives": [
      {
        "aspect": "Professional tone",
        "description": "Email maintains a friendly, professional voice"
      }
    ],
    "technicalDetails": {
      "hasAllCaps": false,
      "excessivePunctuation": false,
      "spamWordCount": 3,
      "linkCount": 0,
      "hasUnsubscribe": false
    },
    "suggestedRewrite": null
  },
  "processingTimeMs": 1247,
  "timestamp": "2025-11-17T10:30:00.123Z"
}
```

### Verdict Types
- `INBOX_READY` - Good to send (spam score < 30)
- `NEEDS_IMPROVEMENT` - Some issues (spam score 30-60)
- `HIGH_RISK` - Major issues (spam score 60-80)
- `SPAM_LIKELY` - Will likely be flagged (spam score 80+)

### Understanding the Analysis Object

The `analysis` object contains rich, detailed feedback:

**`spamIndicators`** - Specific issues found with context and examples:
- `type`: "critical" | "warning" | "info"
- `category`: "content" | "formatting" | "links" | "subject" | "technical"
- `issue`: What's wrong (e.g., "Contains 3 spam trigger words: 'free', 'click here', 'act now'")
- `explanation`: Why it's a problem
- `recommendation`: How to fix it (with specific examples from your email)
- `impact`: "high" | "medium" | "low"

**`recommendations`** - Prioritized action items:
- `priority`: 1-10 (10 = most urgent)
- `action`: What to do
- `impact`: Expected improvement level
- `details`: Specific guidance with before/after examples

**`positives`** - What's working well in your email:
- `aspect`: What's good (e.g., "Professional tone", "Clean subject line")
- `description`: Why it helps deliverability

**`suggestedRewrite`** - AI-powered rewrite (only if spam score > 50):
- Complete rewritten version that fixes all issues
- Keeps your core message while improving deliverability

**`technicalDetails`** - Raw metrics:
- `hasAllCaps`: Boolean
- `excessivePunctuation`: Boolean
- `spamWordCount`: Number of spam trigger words
- `linkCount`: Number of links found
- `hasUnsubscribe`: Boolean

### Error Responses

**401 Unauthorized** - Invalid or missing API key
```json
{
  "error": "Invalid API key"
}
```

**400 Bad Request** - Missing required fields
```json
{
  "error": "Subject and body are required"
}
```

**403 Forbidden** - Monthly limit exceeded
```json
{
  "error": "Monthly limit exceeded",
  "current": 1000,
  "limit": 1000
}
```

**429 Too Many Requests** - Rate limit hit
```json
{
  "error": "Rate limit exceeded",
  "resetTime": "2025-11-17T11:00:00Z"
}
```

---

## Step 5: Code Examples

### JavaScript/Node.js
```javascript
async function analyzeEmail(subject, body) {
  const response = await fetch('https://spamrun.com/api/email-checker/analyze', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer sr_live_abc123def456...',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ subject, body })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`API Error: ${error.error}`);
  }

  return await response.json();
}

// Usage
try {
  const result = await analyzeEmail(
    'Check out our new features!',
    'Hi John,\n\nWe just launched some exciting updates...'
  );
  
  console.log('Spam Score:', result.spamScore);
  console.log('Verdict:', result.verdict);
  
  // Display all recommendations
  result.analysis.recommendations.forEach(rec => {
    console.log(`[${rec.impact}] ${rec.action}: ${rec.details}`);
  });
  
  // Display issues with specific examples
  result.analysis.spamIndicators.forEach(issue => {
    console.log(`${issue.type}: ${issue.issue}`);
    console.log(`Fix: ${issue.recommendation}`);
  });
  
  // Show positives
  result.analysis.positives.forEach(positive => {
    console.log(`✓ ${positive.aspect}: ${positive.description}`);
  });
  
  // Display AI rewrite if available
  if (result.analysis.suggestedRewrite) {
    console.log('Suggested Rewrite:', result.analysis.suggestedRewrite);
  }
} catch (error) {
  console.error('Failed to analyze:', error.message);
}
```

### Complete UI Display Example
```javascript
// How to display the full analysis in your UI
function displayAnalysis(result) {
  // Header with scores
  console.log(`
═══════════════════════════════════════
  SPAM ANALYSIS RESULTS
═══════════════════════════════════════
Spam Score:        ${result.spamScore}/100
Deliverability:    ${result.deliverabilityScore}/100
Inbox Rate:        ${result.estimatedInboxRate}%
Verdict:           ${result.verdict}
  `);
  
  // Issues & Fixes
  if (result.analysis.spamIndicators.length > 0) {
    console.log('\n🚨 ISSUES FOUND:\n');
    result.analysis.spamIndicators.forEach((issue, i) => {
      console.log(`${i + 1}. [${issue.impact.toUpperCase()}] ${issue.issue}`);
      console.log(`   Why: ${issue.explanation}`);
      console.log(`   Fix: ${issue.recommendation}\n`);
    });
  }
  
  // Top Recommendations
  if (result.analysis.recommendations.length > 0) {
    console.log('\n💡 TOP RECOMMENDATIONS:\n');
    result.analysis.recommendations
      .sort((a, b) => b.priority - a.priority)
      .slice(0, 3)
      .forEach((rec, i) => {
        console.log(`${i + 1}. ${rec.action} [${rec.impact}]`);
        console.log(`   ${rec.details}\n`);
      });
  }
  
  // Positives
  if (result.analysis.positives.length > 0) {
    console.log('\n✅ WHAT\'S WORKING:\n');
    result.analysis.positives.forEach(positive => {
      console.log(`• ${positive.aspect}: ${positive.description}`);
    });
  }
  
  // AI Suggested Rewrite
  if (result.analysis.suggestedRewrite) {
    console.log('\n✨ AI-SUGGESTED REWRITE:\n');
    console.log(result.analysis.suggestedRewrite);
  }
}
```

### Python
```python
import requests

def analyze_email(subject, body, api_key):
    response = requests.post(
        'https://spamrun.com/api/email-checker/analyze',
        headers={
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json',
        },
        json={
            'subject': subject,
            'body': body
        }
    )
    
    response.raise_for_status()
    return response.json()

# Usage
try:
    result = analyze_email(
        subject='Check out our new features!',
        body='Hi John,\n\nWe just launched some exciting updates...',
        api_key='sr_live_abc123def456...'
    )
    
    print(f"Spam Score: {result['spamScore']}")
    print(f"Verdict: {result['verdict']}")
    print(f"Recommendations: {len(result['analysis']['recommendations'])}")
except requests.exceptions.RequestException as e:
    print(f"Failed to analyze: {e}")
```

### PHP
```php
<?php
function analyzeEmail($subject, $body, $apiKey) {
    $url = 'https://spamrun.com/api/email-checker/analyze';
    
    $data = json_encode([
        'subject' => $subject,
        'body' => $body
    ]);
    
    $options = [
        'http' => [
            'method' => 'POST',
            'header' => [
                "Authorization: Bearer $apiKey",
                "Content-Type: application/json"
            ],
            'content' => $data
        ]
    ];
    
    $context = stream_context_create($options);
    $response = file_get_contents($url, false, $context);
    
    return json_decode($response, true);
}

// Usage
try {
    $result = analyzeEmail(
        'Check out our new features!',
        'Hi John,\n\nWe just launched some exciting updates...',
        'sr_live_abc123def456...'
    );
    
    echo "Spam Score: " . $result['spamScore'] . "\n";
    echo "Verdict: " . $result['verdict'] . "\n";
} catch (Exception $e) {
    echo "Failed to analyze: " . $e->getMessage();
}
?>
```

### Ruby
```ruby
require 'net/http'
require 'json'

def analyze_email(subject, body, api_key)
  uri = URI('https://spamrun.com/api/email-checker/analyze')
  
  request = Net::HTTP::Post.new(uri)
  request['Authorization'] = "Bearer #{api_key}"
  request['Content-Type'] = 'application/json'
  request.body = { subject: subject, body: body }.to_json
  
  response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: true) do |http|
    http.request(request)
  end
  
  JSON.parse(response.body)
end

# Usage
begin
  result = analyze_email(
    'Check out our new features!',
    'Hi John,\n\nWe just launched some exciting updates...',
    'sr_live_abc123def456...'
  )
  
  puts "Spam Score: #{result['spamScore']}"
  puts "Verdict: #{result['verdict']}"
rescue StandardError => e
  puts "Failed to analyze: #{e.message}"
end
```

---

## Step 6: Best Practices

### Security
- **Store API keys securely**: Use environment variables, never hardcode
- **Keep keys private**: Don't commit to version control
- **Rotate regularly**: Generate new keys periodically

### Performance
- **Cache results**: Don't re-analyze identical emails
- **Batch requests**: Analyze before sending, not during send
- **Handle errors**: Implement retries with exponential backoff

### Usage Optimization
- **Check templates**: Analyze email templates, not every send
- **Focus on bulk**: Use for marketing/promotional emails
- **Skip transactional**: Don't waste checks on receipts/confirmations

### Error Handling
```javascript
async function analyzeEmailWithRetry(subject, body, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch('https://spamrun.com/api/email-checker/analyze', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.SPAMRUN_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subject, body })
      });

      if (!response.ok) {
        const error = await response.json();
        
        // Don't retry on auth/validation errors
        if (response.status === 401 || response.status === 400) {
          throw new Error(error.error);
        }
        
        // Don't retry on limit exceeded
        if (response.status === 403) {
          throw new Error('Monthly API limit exceeded');
        }
        
        // Retry on rate limit or server errors
        if (response.status === 429 || response.status >= 500) {
          if (i === maxRetries - 1) throw new Error(error.error);
          await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
          continue;
        }
      }

      return await response.json();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}
```

---

## Step 7: Testing

### Test with a Known Spammy Email
```bash
curl -X POST https://spamrun.com/api/email-checker/analyze \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "subject": "!!!FREE MONEY!!! ACT NOW!!!",
    "body": "CLICK HERE CLICK HERE CLICK HERE http://spam.com http://spam.com http://spam.com"
  }'
```

Expected result: High spam score (70+), verdict: `SPAM_LIKELY`

### Test with a Clean Email
```bash
curl -X POST https://spamrun.com/api/email-checker/analyze \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "subject": "Quick question about your order",
    "body": "Hi Sarah,\n\nI wanted to follow up on your recent order #12345. Do you have any questions?\n\nBest,\nPatrick"
  }'
```

Expected result: Low spam score (<30), verdict: `INBOX_READY`

---

## Common Integration Patterns

### 1. Email Campaign Platform
Check all emails before scheduling:
```javascript
async function scheduleEmailCampaign(campaign) {
  // Analyze the template
  const analysis = await analyzeEmail(campaign.subject, campaign.body);
  
  // Block if spam score too high
  if (analysis.spamScore > 60) {
    throw new Error('Email has high spam score. Please revise before sending.');
  }
  
  // Warn if needs improvement
  if (analysis.verdict === 'NEEDS_IMPROVEMENT') {
    console.warn('Recommendations:', analysis.analysis.recommendations);
  }
  
  // Proceed with scheduling
  return scheduleEmail(campaign);
}
```

### 2. Form Handler
Analyze form submissions before emailing:
```javascript
app.post('/contact', async (req, res) => {
  const { name, email, message } = req.body;
  
  const subject = `Contact from ${name}`;
  const body = message;
  
  // Check for spam before processing
  const analysis = await analyzeEmail(subject, body);
  
  if (analysis.spamScore > 70) {
    return res.status(400).json({ error: 'Message appears to be spam' });
  }
  
  // Send email
  await sendEmail(email, subject, body);
  res.json({ success: true });
});
```

### 3. CRM Integration
Add to workflow before bulk send:
```python
def send_marketing_campaign(recipients, template):
    # Analyze template first
    analysis = analyze_email(
        subject=template['subject'],
        body=template['body'],
        api_key=os.getenv('SPAMRUN_API_KEY')
    )
    
    # Store analysis in CRM
    log_analysis(campaign_id, analysis)
    
    # Alert if issues found
    if analysis['verdict'] != 'INBOX_READY':
        notify_marketing_team(analysis['analysis']['recommendations'])
    
    # Proceed with send
    for recipient in recipients:
        send_email(recipient, template)
```

---

## Support

- **Documentation**: https://spamrun.com/api-docs
- **Dashboard**: https://spamrun.com/dashboard
- **Contact**: https://spamrun.com/contact

---

## Quick Reference

| Aspect | Details |
|--------|---------|
| **Endpoint** | `POST https://spamrun.com/api/email-checker/analyze` |
| **Auth Header** | `Authorization: Bearer sr_live_...` |
| **Required Fields** | `subject` (string), `body` (string) |
| **Success Code** | `200 OK` |
| **Typical Response Time** | 1-3 seconds |
| **Max Request Size** | 10 MB |

---

## That's It!

You now have everything needed to integrate SpamRun into your application. The API is RESTful, well-documented, and returns detailed analysis with actionable recommendations.

**Remember**: Store your API key securely and never commit it to version control!

