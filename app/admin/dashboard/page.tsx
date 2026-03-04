'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { BookOpen, ClipboardCheck, FileText, Users, Plus, ArrowRight, Eye, BarChart3 } from 'lucide-react'

interface DashboardStats {
  publishedBlogPosts: number
  pendingApprovals: number
  totalPages: number
  pageViewsWeek: number
  pageViewsToday: number
  recentActivity: {
    id: string
    content_type: string
    status: string
    submitted_at: string
    content_snapshot: { title?: string }
    submitter: { full_name: string } | null
  }[]
}

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/dashboard/stats')
        if (res.ok) {
          setStats(await res.json())
        }
      } catch {
        // ignore — show fallback
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-gray-600 mt-2">Welcome to Rise Financial Partners Admin</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <BookOpen size={20} className="text-green-700" />
            </div>
            <h3 className="text-gray-600 text-sm font-medium">Blog Posts</h3>
          </div>
          <p className="text-3xl font-bold text-rise-navy">
            {loading ? '—' : stats?.publishedBlogPosts ?? 0}
          </p>
          <p className="text-gray-500 text-sm mt-1">Published</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <ClipboardCheck size={20} className="text-yellow-700" />
            </div>
            <h3 className="text-gray-600 text-sm font-medium">Pending Approvals</h3>
          </div>
          <p className="text-3xl font-bold text-rise-gold">
            {loading ? '—' : stats?.pendingApprovals ?? 0}
          </p>
          <p className="text-gray-500 text-sm mt-1">Awaiting review</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText size={20} className="text-blue-700" />
            </div>
            <h3 className="text-gray-600 text-sm font-medium">Pages</h3>
          </div>
          <p className="text-3xl font-bold text-rise-navy">
            {loading ? '—' : stats?.totalPages ?? 0}
          </p>
          <p className="text-gray-500 text-sm mt-1">Total</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Eye size={20} className="text-purple-700" />
            </div>
            <h3 className="text-gray-600 text-sm font-medium">Page Views</h3>
          </div>
          <p className="text-3xl font-bold text-rise-navy">
            {loading ? '—' : stats?.pageViewsWeek ?? 0}
          </p>
          <p className="text-gray-500 text-sm mt-1">
            Last 7 days · {loading ? '—' : stats?.pageViewsToday ?? 0} today
          </p>
        </div>
      </div>

      {/* Quick Links */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          href="/admin/compliance"
          className="flex items-center justify-between p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-3">
            <ClipboardCheck size={18} className="text-rise-navy" />
            <span className="text-sm font-medium text-gray-700">Review Compliance Queue</span>
          </div>
          {stats && stats.pendingApprovals > 0 && (
            <span className="px-2 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
              {stats.pendingApprovals}
            </span>
          )}
        </Link>
        <Link
          href="/admin/blog/new"
          className="flex items-center gap-3 p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <Plus size={18} className="text-rise-navy" />
          <span className="text-sm font-medium text-gray-700">Create Blog Post</span>
        </Link>
        <Link
          href="/admin/pages/new"
          className="flex items-center gap-3 p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <Plus size={18} className="text-rise-navy" />
          <span className="text-sm font-medium text-gray-700">Create Page</span>
        </Link>
        <Link
          href="/admin/analytics"
          className="flex items-center gap-3 p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <BarChart3 size={18} className="text-rise-navy" />
          <span className="text-sm font-medium text-gray-700">View Analytics</span>
        </Link>
      </div>

      {/* Recent Activity */}
      {stats && stats.recentActivity.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            <Link href="/admin/compliance" className="inline-flex items-center gap-1 text-sm text-rise-navy hover:underline">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="bg-white rounded-lg shadow divide-y divide-gray-100">
            {stats.recentActivity.map((activity) => (
              <Link
                key={activity.id}
                href={`/admin/compliance/${activity.id}`}
                className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {activity.content_snapshot?.title || 'Untitled'}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {activity.content_type === 'blog_post' ? 'Blog Post' : 'Page'} by {activity.submitter?.full_name || 'Unknown'}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full capitalize ${STATUS_STYLES[activity.status] || ''}`}>
                    {activity.status}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(activity.submitted_at).toLocaleDateString()}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
