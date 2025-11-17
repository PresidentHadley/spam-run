import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { analyzeEmail } from '@/lib/email-analyzer'
import { checkUsageLimit, incrementUsage } from '@/lib/usage-tracker'
import { webRateLimiter, apiRateLimiter } from '@/lib/rate-limiter'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { subject, body: emailBody } = body

    if (!subject || !emailBody) {
      return NextResponse.json(
        { error: 'Subject and body are required' },
        { status: 400 }
      )
    }

    // Check if it's an API request or web request
    const authHeader = request.headers.get('Authorization')
    const isApiRequest = authHeader?.startsWith('Bearer sr_')

    let userId: string
    let source: 'web' | 'api' = 'web'

    if (isApiRequest && authHeader) {
      // API authentication
      const apiKey = authHeader.replace('Bearer ', '')
      
      console.log('🔑 API Key received:', apiKey.substring(0, 20) + '...')
      
      const supabaseService = createClient()
      
      // Get all active keys and compare with bcrypt
      const { data: apiKeys, error: keyError } = await supabaseService
        .from('api_keys')
        .select('*, profiles(*)')
        .eq('is_active', true)

      console.log('📊 Found active keys:', apiKeys?.length || 0)
      
      if (keyError || !apiKeys || apiKeys.length === 0) {
        console.error('❌ No active keys found or error:', keyError)
        return NextResponse.json(
          { error: 'Invalid API key' },
          { status: 401 }
        )
      }

      // Find matching key using bcrypt compare
      const bcrypt = await import('bcryptjs')
      let apiKeyData = null
      for (const key of apiKeys) {
        console.log('🔍 Comparing with key:', key.key_prefix, 'hash:', key.key_hash.substring(0, 20) + '...')
        if (bcrypt.compareSync(apiKey, key.key_hash)) {
          console.log('✅ Key matched!')
          apiKeyData = key
          break
        }
      }

      if (!apiKeyData) {
        console.error('❌ No matching key found after bcrypt comparison')
        return NextResponse.json(
          { error: 'Invalid API key' },
          { status: 401 }
        )
      }
      
      console.log('✅ Authentication successful for user:', apiKeyData.user_id)

      userId = apiKeyData.user_id
      source = 'api'

      // Rate limiting for API
      const rateLimitResult = apiRateLimiter.check(userId)
      if (!rateLimitResult.allowed) {
        return NextResponse.json(
          { error: 'Rate limit exceeded', resetTime: rateLimitResult.resetTime },
          { status: 429 }
        )
      }

      // Update API key last used
      await supabaseService
        .from('api_keys')
        .update({ last_used_at: new Date().toISOString() })
        .eq('id', apiKeyData.id)
    } else {
      // Web authentication
      const supabase = createClient()
      const { data: { user }, error: authError } = await supabase.auth.getUser()

      if (authError || !user) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        )
      }

      userId = user.id

      // Rate limiting for web
      const rateLimitResult = webRateLimiter.check(userId)
      if (!rateLimitResult.allowed) {
        return NextResponse.json(
          { error: 'Too many requests. Please wait a moment.' },
          { status: 429 }
        )
      }
    }

    // Check usage limits
    const usageCheck = await checkUsageLimit(userId)
    if (!usageCheck.allowed) {
      return NextResponse.json(
        { 
          error: 'Monthly limit exceeded',
          current: usageCheck.current,
          limit: usageCheck.limit,
        },
        { status: 403 }
      )
    }

    // Perform analysis
    const analysis = await analyzeEmail(subject, emailBody)

    // Store the check
    const supabase = createClient()
    const { error: insertError } = await supabase
      .from('email_checks')
      .insert({
        user_id: userId,
        check_source: source,
        subject_line: subject,
        email_body: emailBody,
        spam_score: analysis.spamScore,
        deliverability_score: analysis.deliverabilityScore,
        estimated_inbox_rate: analysis.estimatedInboxRate,
        verdict: analysis.verdict,
        analysis_results: analysis.analysis as any,
        processing_time_ms: analysis.processingTimeMs,
      })

    if (insertError) {
      console.error('Error storing check:', insertError)
    }

    // Increment usage
    await incrementUsage(userId, source)

    return NextResponse.json(analysis)
  } catch (error: any) {
    console.error('Error analyzing email:', error)
    return NextResponse.json(
      { error: 'Failed to analyze email', message: error.message },
      { status: 500 }
    )
  }
}

