import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { z } from 'zod'
import { createAdminClient } from '@/lib/supabase/admin'

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

// Submitted values are interpolated into the notification email
function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

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
    const source = data.source ?? 'Contact Page'

    // Persist first so the lead survives an email failure
    const supabase = createAdminClient()
    const { data: lead, error: dbError } = await supabase
      .from('leads')
      .insert({
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        phone: data.phone || null,
        investable_assets: data.investableAssets || null,
        current_situation: data.currentSituation || null,
        message: data.message || null,
        source,
      })
      .select('id')
      .single()

    if (dbError) {
      console.error('[api/contact] Failed to store lead:', dbError)
      return NextResponse.json(
        { error: 'Failed to submit your request. Please try again.' },
        { status: 500 }
      )
    }

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

    let emailSent = false
    let emailError: string | null = null

    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      console.error('[api/contact] RESEND_API_KEY is not set')
      emailError = 'RESEND_API_KEY is not set'
    } else {
      const resend = new Resend(apiKey)
      const { error } = await resend.emails.send({
        from: 'Rise Financial Website <onboarding@resend.dev>',
        to: ['josh@risewisely.com'],
        reply_to: data.email,
        subject: `New Consultation Request from ${data.firstName} ${data.lastName}`,
        html: `
        <h2>New Consultation Request</h2>
        <p><strong>Source:</strong> ${escapeHtml(source)}</p>
        <hr />
        <p><strong>Name:</strong> ${escapeHtml(data.firstName)} ${escapeHtml(data.lastName)}</p>
        <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(data.phone || 'Not provided')}</p>
        <p><strong>Investable Assets:</strong> ${escapeHtml(assetLabel)}</p>
        <p><strong>Current Situation:</strong> ${escapeHtml(situationLabel)}</p>
        ${data.message ? `<p><strong>Message:</strong></p><p>${escapeHtml(data.message)}</p>` : ''}
        <hr />
        <p style="color: #666; font-size: 12px;">Sent from the Rise Financial Partners website &middot; Lead ID ${lead.id}</p>
      `,
      })

      if (error) {
        console.error('[api/contact] Resend error:', error)
        emailError = error.message ?? 'Unknown Resend error'
      } else {
        emailSent = true
      }
    }

    await supabase
      .from('leads')
      .update({ email_sent: emailSent, email_error: emailError })
      .eq('id', lead.id)

    // The lead is stored, so the submission succeeded from the visitor's perspective
    // even if the notification email did not go out.
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[api/contact] Unexpected error:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
