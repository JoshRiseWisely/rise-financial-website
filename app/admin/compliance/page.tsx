'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ClipboardCheck, Eye } from 'lucide-react'

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
}

const TYPE_STYLES: Record<string, string> = {
  blog_post: 'bg-purple-100 text-purple-800',
  page: 'bg-blue-100 text-blue-800',
}

interface ComplianceItem {
  id: string
  content_type: string
  content_id: string
  status: string
  submitted_at: string
  reviewed_at: string | null
  content_snapshot: { title?: string }
  submitter: { id: string; full_name: string; email: string } | null
  reviewer: { id: string; full_name: string } | null
}

export default function CompliancePage() {
  const [items, setItems] = useState<ComplianceItem[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [statusFilter, setStatusFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')

  useEffect(() => {
    fetchItems()
  }, [statusFilter, typeFilter])

  async function fetchItems() {
    setLoading(true)
    const params = new URLSearchParams()
    if (statusFilter) params.set('status', statusFilter)
    if (typeFilter) params.set('content_type', typeFilter)
    params.set('limit', '50')

    const res = await fetch(`/api/compliance?${params}`)
    if (res.ok) {
      const data = await res.json()
      setItems(data.items)
      setTotal(data.total)
    }
    setLoading(false)
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <ClipboardCheck size={24} className="text-rise-navy" />
          <h1 className="text-2xl font-bold text-rise-navy">Compliance Queue</h1>
          {total > 0 && (
            <span className="px-2 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
              {total} total
            </span>
          )}
        </div>
      </div>

      <div className="flex gap-3 mb-6">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-rise-navy/20 focus:border-rise-navy outline-none"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-rise-navy/20 focus:border-rise-navy outline-none"
        >
          <option value="">All Types</option>
          <option value="blog_post">Blog Post</option>
          <option value="page">Page</option>
        </select>
      </div>

      {loading ? (
        <div className="text-gray-500">Loading...</div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <ClipboardCheck size={48} className="mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-medium">No items in queue</p>
          <p className="text-sm mt-1">Content submitted for review will appear here.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Title</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Type</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Submitted By</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Date</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {item.content_snapshot?.title || 'Untitled'}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${TYPE_STYLES[item.content_type] || ''}`}>
                      {item.content_type === 'blog_post' ? 'Blog Post' : 'Page'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {item.submitter?.full_name || 'Unknown'}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(item.submitted_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full capitalize ${STATUS_STYLES[item.status] || ''}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/compliance/${item.id}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-rise-navy bg-rise-navy/10 rounded-lg hover:bg-rise-navy/20 transition-colors"
                    >
                      <Eye size={14} />
                      Review
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
