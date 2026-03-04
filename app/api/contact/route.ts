import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { z } from 'zod'

const contactSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  investableAssets: z.string().optional(),
  currentSituation: z.string().optional(),
  message: z.string().optional(),
  source: z.string().optional(),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const parsed = contactSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const data = parsed.data

    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      console.error('[api/contact] RESEND_API_KEY is not set')
      return NextResponse.json(
        { error: 'Service unavailable' },
        { status: 500 }
      )
    }

    const resend = new Resend(apiKey)

    const assetLabel = data.investableAssets
      ? {
          'under-250k': 'Under $250,000',
          '250k-500k': '$250,000 - $500,000',
          '500k-1m': '$500,000 - $1,000,000',
          '1m-5m': '$1,000,000 - $5,000,000',
          '5m-plus': '$5,000,000+',
        }[data.investableAssets] ?? data.investableAssets
      : 'Not specified'

    const situationLabel = data.currentSituation
      ? {
          accumulating: 'Building Wealth',
          'pre-retirement': 'Preparing for Retirement',
          retired: 'Currently Retired',
          'business-owner': 'Business Owner',
          inheritance: 'Received Inheritance',
          other: 'Other',
        }[data.currentSituation] ?? data.currentSituation
      : 'Not specified'

    const { error } = await resend.emails.send({
      from: 'Rise Financial Website <onboarding@resend.dev>',
      to: ['info@RiseWisely.com'],
      subject: `New Consultation Request from ${data.firstName} ${data.lastName}`,
      html: `
        <h2>New Consultation Request</h2>
        <p><strong>Source:</strong> ${data.source ?? 'Contact Page'}</p>
        <hr />
        <p><strong>Name:</strong> ${data.firstName} ${data.lastName}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Phone:</strong> ${data.phone || 'Not provided'}</p>
        <p><strong>Investable Assets:</strong> ${assetLabel}</p>
        <p><strong>Current Situation:</strong> ${situationLabel}</p>
        ${data.message ? `<p><strong>Message:</strong></p><p>${data.message}</p>` : ''}
        <hr />
        <p style="color: #666; font-size: 12px;">Sent from the Rise Financial Partners website</p>
      `,
    })

    if (error) {
      console.error('[api/contact] Resend error:', error)
      return NextResponse.json(
        { error: 'Failed to send message' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[api/contact] Unexpected error:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
