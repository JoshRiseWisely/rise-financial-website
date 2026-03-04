import { Resend } from 'resend'
import { createAdminClient } from '@/lib/supabase/admin'

let _resend: Resend | null = null
function getResend(): Resend {
  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY)
  }
  return _resend
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://rise-financial-website-production-bfa8.up.railway.app'
const FROM_ADDRESS = 'Rise Financial Website <onboarding@resend.dev>'

function emailLayout(body: string): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
<body style="margin:0;padding:0;background-color:#f8f6f1;font-family:system-ui,-apple-system,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8f6f1;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
        <!-- Header -->
        <tr><td style="background-color:#1a2e4c;padding:24px 32px;border-radius:12px 12px 0 0;">
          <table width="100%" cellpadding="0" cellspacing="0"><tr>
            <td>
              <span style="color:white;font-size:20px;font-weight:700;letter-spacing:-0.5px;">Rise Financial</span>
              <span style="color:#5b8fb9;font-size:11px;text-transform:uppercase;letter-spacing:2px;display:block;">Partners</span>
            </td>
            <td align="right">
              <span style="color:#c9a961;font-size:12px;">Wealth Management</span>
            </td>
          </tr></table>
        </td></tr>
        <!-- Body -->
        <tr><td style="background-color:#ffffff;padding:32px;">
          ${body}
        </td></tr>
        <!-- Footer -->
        <tr><td style="background-color:#f0ede6;padding:20px 32px;border-radius:0 0 12px 12px;text-align:center;">
          <p style="margin:0;color:#4a5568;font-size:12px;">Rise Financial Partners | Sarasota, FL</p>
          <p style="margin:4px 0 0;color:#4a5568;font-size:11px;opacity:0.7;">This is an automated notification from your content management system.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

function button(text: string, href: string): string {
  return `<a href="${href}" style="display:inline-block;padding:12px 28px;background-color:#1a2e4c;color:#ffffff;text-decoration:none;border-radius:8px;font-weight:600;font-size:14px;margin-top:8px;">${text}</a>`
}

async function getComplianceReviewerEmails(): Promise<string[]> {
  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('profiles')
      .select('email')
      .in('role', ['admin', 'compliance'])
      .eq('is_active', true)

    if (error || !data) return []
    return data.map((p) => p.email).filter(Boolean) as string[]
  } catch (err) {
    console.error('[email] Failed to fetch reviewer emails:', err)
    return []
  }
}

async function getAuthorEmail(authorId: string): Promise<{ email: string; name: string } | null> {
  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('profiles')
      .select('email, full_name')
      .eq('id', authorId)
      .single()

    if (error || !data || !data.email) return null
    return { email: data.email, name: data.full_name || 'Team Member' }
  } catch (err) {
    console.error('[email] Failed to fetch author email:', err)
    return null
  }
}

function contentLabel(contentType: string): string {
  return contentType === 'blog_post' ? 'Blog Post' : 'Page'
}

export async function notifyContentSubmitted(params: {
  contentType: 'blog_post' | 'page'
  contentTitle: string
  contentId: string
  submitterName: string
}) {
  try {
    const to = await getComplianceReviewerEmails()
    if (to.length === 0) {
      console.log('[email] No compliance reviewers to notify')
      return
    }

    const label = contentLabel(params.contentType)
    const subject = `New ${label} Submitted for Review: ${params.contentTitle}`
    const body = `
      <h2 style="margin:0 0 16px;color:#1a2e4c;font-size:22px;">Content Submitted for Review</h2>
      <p style="color:#4a5568;font-size:14px;line-height:1.6;margin:0 0 16px;">
        <strong>${params.submitterName}</strong> has submitted a ${label.toLowerCase()} for compliance review.
      </p>
      <table style="width:100%;border-collapse:collapse;margin:16px 0;">
        <tr>
          <td style="padding:8px 12px;background:#f8f6f1;border-radius:6px 6px 0 0;font-size:12px;color:#4a5568;font-weight:600;">TITLE</td>
          <td style="padding:8px 12px;background:#f8f6f1;border-radius:6px 6px 0 0;font-size:12px;color:#4a5568;font-weight:600;">TYPE</td>
        </tr>
        <tr>
          <td style="padding:8px 12px;font-size:14px;color:#1a2e4c;border-bottom:1px solid #e2e8f0;">${params.contentTitle}</td>
          <td style="padding:8px 12px;font-size:14px;color:#1a2e4c;border-bottom:1px solid #e2e8f0;">${label}</td>
        </tr>
      </table>
      <p style="margin:20px 0 0;">
        ${button('Review in Dashboard', `${SITE_URL}/admin/compliance`)}
      </p>
    `

    await getResend().emails.send({
      from: FROM_ADDRESS,
      to,
      subject,
      html: emailLayout(body),
    })
    console.log(`[email] Submitted notification sent for ${label}: ${params.contentTitle}`)
  } catch (err) {
    console.error('[email] Failed to send submitted notification:', err)
  }
}

export async function notifyContentReviewed(params: {
  contentType: string
  contentTitle: string
  contentId: string
  authorId: string
  action: string
  reviewerNotes?: string
}) {
  try {
    const author = await getAuthorEmail(params.authorId)
    if (!author) {
      console.log('[email] No author email found for:', params.authorId)
      return
    }

    const label = contentLabel(params.contentType)
    const isApproved = params.action === 'approved'
    const statusColor = isApproved ? '#16a34a' : '#dc2626'
    const statusText = isApproved ? 'Approved' : 'Rejected'
    const subject = `Your ${label} has been ${statusText.toLowerCase()}: ${params.contentTitle}`

    const editPath = params.contentType === 'blog_post'
      ? `/admin/blog/${params.contentId}/edit`
      : `/admin/pages/${params.contentId}/edit`

    const body = `
      <h2 style="margin:0 0 16px;color:#1a2e4c;font-size:22px;">Content ${statusText}</h2>
      <p style="color:#4a5568;font-size:14px;line-height:1.6;margin:0 0 16px;">
        Hi ${author.name}, your ${label.toLowerCase()} has been reviewed.
      </p>
      <table style="width:100%;border-collapse:collapse;margin:16px 0;">
        <tr>
          <td style="padding:10px 14px;background:#f8f6f1;font-size:13px;color:#4a5568;width:100px;font-weight:600;">Title</td>
          <td style="padding:10px 14px;font-size:14px;color:#1a2e4c;">${params.contentTitle}</td>
        </tr>
        <tr>
          <td style="padding:10px 14px;background:#f8f6f1;font-size:13px;color:#4a5568;font-weight:600;">Status</td>
          <td style="padding:10px 14px;">
            <span style="display:inline-block;padding:4px 12px;border-radius:12px;font-size:12px;font-weight:600;color:white;background-color:${statusColor};">${statusText}</span>
          </td>
        </tr>
        ${params.reviewerNotes ? `
        <tr>
          <td style="padding:10px 14px;background:#f8f6f1;font-size:13px;color:#4a5568;font-weight:600;">Notes</td>
          <td style="padding:10px 14px;font-size:14px;color:#4a5568;font-style:italic;">${params.reviewerNotes}</td>
        </tr>
        ` : ''}
      </table>
      ${isApproved
        ? '<p style="color:#4a5568;font-size:14px;margin:16px 0 0;">An administrator can now publish your content to the live site.</p>'
        : '<p style="color:#4a5568;font-size:14px;margin:16px 0 0;">Please review the notes above, make revisions, and resubmit when ready.</p>'
      }
      <p style="margin:20px 0 0;">
        ${button(isApproved ? 'View in Dashboard' : 'Edit Content', `${SITE_URL}${editPath}`)}
      </p>
    `

    await getResend().emails.send({
      from: FROM_ADDRESS,
      to: author.email,
      subject,
      html: emailLayout(body),
    })
    console.log(`[email] Review notification sent to ${author.email}: ${statusText}`)
  } catch (err) {
    console.error('[email] Failed to send review notification:', err)
  }
}

export async function notifyContentPublished(params: {
  contentType: 'blog_post' | 'page'
  contentTitle: string
  contentSlug: string
  authorId: string
}) {
  try {
    const author = await getAuthorEmail(params.authorId)
    if (!author) {
      console.log('[email] No author email found for:', params.authorId)
      return
    }

    const label = contentLabel(params.contentType)
    const publicPath = params.contentType === 'blog_post'
      ? `/blog/${params.contentSlug}`
      : `/p/${params.contentSlug}`

    const subject = `Your ${label} is now live: ${params.contentTitle}`
    const body = `
      <h2 style="margin:0 0 16px;color:#1a2e4c;font-size:22px;">Your Content is Live!</h2>
      <p style="color:#4a5568;font-size:14px;line-height:1.6;margin:0 0 16px;">
        Hi ${author.name}, your ${label.toLowerCase()} <strong>"${params.contentTitle}"</strong> has been published and is now available on the Rise Financial Partners website.
      </p>
      <p style="margin:20px 0 0;">
        ${button('View Live Page', `${SITE_URL}${publicPath}`)}
      </p>
    `

    await getResend().emails.send({
      from: FROM_ADDRESS,
      to: author.email,
      subject,
      html: emailLayout(body),
    })
    console.log(`[email] Published notification sent to ${author.email}: ${params.contentTitle}`)
  } catch (err) {
    console.error('[email] Failed to send published notification:', err)
  }
}
