import { NextResponse } from 'next/server'
import { Resend } from 'resend'

// Initialize Resend client
function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    throw new Error('RESEND_API_KEY is not configured')
  }
  return new Resend(apiKey)
}

export async function POST(req: Request) {
  try {
    const { name, email, subject, message } = await req.json()

    // Validate inputs
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      )
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    const resend = getResendClient()

    // Send email via Resend
    const data = await resend.emails.send({
      from: 'SpamRun Contact <onboarding@resend.dev>', // You'll need to verify a domain or use Resend's test domain
      to: ['patrick@mgphq.com'],
      replyTo: email,
      subject: subject || `Contact Form: Message from ${name}`,
      html: `
        <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1f2937; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0 0 10px 0;"><strong>From:</strong> ${name}</p>
            <p style="margin: 0 0 10px 0;"><strong>Email:</strong> ${email}</p>
            ${subject ? `<p style="margin: 0;"><strong>Subject:</strong> ${subject}</p>` : ''}
          </div>
          
          <div style="margin: 20px 0;">
            <h3 style="color: #374151; margin-bottom: 10px;">Message:</h3>
            <div style="background: white; padding: 20px; border-left: 4px solid #3b82f6; white-space: pre-wrap;">
              ${message}
            </div>
          </div>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;" />
          
          <p style="color: #6b7280; font-size: 14px; margin: 0;">
            This message was sent from the SpamRun.com contact form.
          </p>
        </div>
      `,
    })

    return NextResponse.json(
      { success: true, messageId: data.id },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Error sending contact email:', error)
    return NextResponse.json(
      { error: 'Failed to send message. Please try again.' },
      { status: 500 }
    )
  }
}

