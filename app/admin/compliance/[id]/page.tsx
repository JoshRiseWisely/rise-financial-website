'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react'

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
}

interface ComplianceItem {
  id: string
  content_type: string
  content_id: string
  status: string
  submitted_at: string
  reviewed_at: string | null
  reviewer_notes: string | null
  content_snapshot: {
    title?: string
    content?: string
    excerpt?: string
    category?: string
    tags?: string[]
    template?: string
    meta_title?: string
    meta_description?: string
  }
  submitter: { id: string; full_name: string; email: string } | null
  reviewer: { id: string; full_name: string } | null
}

export default function ComplianceReviewPage() {
  const params = useParams()
  const router = useRouter()
  const itemId = params.id as string

  const [item, setItem] = useState<ComplianceItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    async function fetchItem() {
      const res = await fetch(`/api/compliance/${itemId}`)
      if (res.ok) {
        setItem(await res.json())
      } else {
        setError('Item not found')
      }
      setLoading(false)
    }
    fetchItem()
  }, [itemId])

  async function handleReview(action: 'approve' | 'reject') {
    setError('')
    setSubmitting(true)

    try {
      const res = await fetch(`/api/compliance/${itemId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, reviewer_notes: notes || undefined }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Failed to submit review')
        return
      }

      router.push('/admin/compliance')
    } catch {
      setError('Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="p-8 text-gray-500">Loading...</div>
  }

  if (!item) {
    return <div className="p-8 text-red-600">{error || 'Item not found'}</div>
  }

  const snapshot = item.content_snapshot

  return (
    <div className="p-8 max-w-5xl">
      <Link href="/admin/compliance" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
        <ArrowLeft size={16} />
        Back to Compliance Queue
      </Link>

      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-2xl font-bold text-rise-navy">
          {snapshot.title || 'Untitled'}
        </h1>
        <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full capitalize ${STATUS_STYLES[item.status] || ''}`}>
          {item.status}
        </span>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>
      )}

      {/* Metadata */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-xs text-gray-500 mb-1">Content Type</div>
          <div className="text-sm font-medium capitalize">{item.content_type.replace(/_/g, ' ')}</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-xs text-gray-500 mb-1">Submitted By</div>
          <div className="text-sm font-medium">{item.submitter?.full_name || 'Unknown'}</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-xs text-gray-500 mb-1">Submitted</div>
          <div className="text-sm font-medium">{new Date(item.submitted_at).toLocaleDateString()}</div>
        </div>
        {snapshot.template && (
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-xs text-gray-500 mb-1">Template</div>
            <div className="text-sm font-medium capitalize">{snapshot.template}</div>
          </div>
        )}
        {snapshot.category && (
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-xs text-gray-500 mb-1">Category</div>
            <div className="text-sm font-medium capitalize">{snapshot.category}</div>
          </div>
        )}
      </div>

      {/* Content Preview */}
      <div className="mb-6">
        <h2 className="text-sm font-medium text-gray-700 mb-2">Content Preview</h2>
        <div className="bg-white border border-gray-200 rounded-lg p-6 max-h-[500px] overflow-y-auto">
          {snapshot.excerpt && (
            <p className="text-sm text-gray-500 italic mb-4 pb-4 border-b border-gray-100">
              {snapshot.excerpt}
            </p>
          )}
          {snapshot.content ? (
            <div
              className="blog-prose"
              dangerouslySetInnerHTML={{ __html: snapshot.content }}
            />
          ) : (
            <p className="text-gray-400">No content</p>
          )}
        </div>
      </div>

      {snapshot.tags && snapshot.tags.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-medium text-gray-700 mb-2">Tags</h2>
          <div className="flex flex-wrap gap-2">
            {snapshot.tags.map((tag) => (
              <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Review Actions or Review Result */}
      {item.status === 'pending' ? (
        <div className="border-t border-gray-200 pt-6">
          <h2 className="text-sm font-medium text-gray-700 mb-2">Review Notes (optional)</h2>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            maxLength={1000}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rise-navy/20 focus:border-rise-navy outline-none resize-none mb-4"
            placeholder="Add notes about this review..."
          />
          <div className="flex gap-3">
            <button
              onClick={() => handleReview('approve')}
              disabled={submitting}
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <CheckCircle size={16} />
              {submitting ? 'Submitting...' : 'Approve'}
            </button>
            <button
              onClick={() => handleReview('reject')}
              disabled={submitting}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <XCircle size={16} />
              {submitting ? 'Submitting...' : 'Reject'}
            </button>
          </div>
        </div>
      ) : (
        <div className="border-t border-gray-200 pt-6">
          <h2 className="text-sm font-medium text-gray-700 mb-2">Review Result</h2>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full capitalize ${STATUS_STYLES[item.status] || ''}`}>
                {item.status}
              </span>
              <span className="text-sm text-gray-500">
                by {item.reviewer?.full_name || 'Unknown'}
              </span>
              {item.reviewed_at && (
                <span className="text-sm text-gray-400">
                  on {new Date(item.reviewed_at).toLocaleDateString()}
                </span>
              )}
            </div>
            {item.reviewer_notes && (
              <p className="text-sm text-gray-700 mt-2">{item.reviewer_notes}</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
