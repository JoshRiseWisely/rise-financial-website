'use client'

import { useState, useEffect, useCallback } from 'react'
import { Eye, Users, TrendingUp, FileText, Globe, ArrowUpRight } from 'lucide-react'

interface AnalyticsData {
  totalViews: number
  uniqueSessions: number
  avgPerDay: number
  topPages: { path: string; views: number }[]
  viewsByDay: { date: string; views: number }[]
  topReferrers: { domain: string; views: number }[]
  period: string
}

const PERIODS = [
  { value: '7d', label: '7 Days' },
  { value: '30d', label: '30 Days' },
  { value: '90d', label: '90 Days' },
]

const PATH_LABELS: Record<string, string> = {
  '/': 'Home',
  '/services': 'Services',
  '/team': 'Team',
  '/contact': 'Contact',
  '/blog': 'Blog',
  '/community': 'Community',
  '/legacy-wealth': 'Legacy Wealth',
  '/client-login': 'Client Login',
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [period, setPeriod] = useState('7d')
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/analytics?period=${period}`)
      if (res.ok) {
        setData(await res.json())
      }
    } catch {
      console.error('Failed to fetch analytics')
    } finally {
      setLoading(false)
    }
  }, [period])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const maxDayViews = data ? Math.max(...data.viewsByDay.map((d) => d.views), 1) : 1
  const maxPageViews = data?.topPages[0]?.views || 1

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-sm text-gray-500 mt-1">Page views and traffic insights</p>
        </div>
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          {PERIODS.map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                period === p.value
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      ) : data ? (
        <>
          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon={Eye}
              label="Total Views"
              value={data.totalViews.toLocaleString()}
              color="blue"
            />
            <StatCard
              icon={Users}
              label="Unique Visitors"
              value={data.uniqueSessions.toLocaleString()}
              color="green"
            />
            <StatCard
              icon={TrendingUp}
              label="Avg Views / Day"
              value={data.avgPerDay.toString()}
              color="purple"
            />
            <StatCard
              icon={FileText}
              label="Top Page"
              value={data.topPages[0] ? formatPath(data.topPages[0].path) : '—'}
              color="amber"
            />
          </div>

          {/* Views Chart */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Daily Views</h2>
            {data.viewsByDay.length === 0 ? (
              <p className="text-gray-500 text-center py-12">No data for this period yet.</p>
            ) : (
              <div className="flex items-end gap-1 h-48">
                {data.viewsByDay.map((day) => (
                  <div
                    key={day.date}
                    className="flex-1 flex flex-col items-center group relative"
                  >
                    <div className="absolute -top-8 hidden group-hover:block bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                      {day.views} views · {formatDate(day.date)}
                    </div>
                    <div
                      className="w-full bg-blue-500 rounded-t hover:bg-blue-600 transition-colors min-h-[2px]"
                      style={{ height: `${(day.views / maxDayViews) * 100}%` }}
                    />
                    {data.viewsByDay.length <= 14 && (
                      <span className="text-[10px] text-gray-400 mt-1 truncate w-full text-center">
                        {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bottom Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Top Pages */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileText size={18} /> Top Pages
              </h2>
              {data.topPages.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No page views yet.</p>
              ) : (
                <div className="space-y-3">
                  {data.topPages.map((page, i) => (
                    <div key={page.path} className="flex items-center gap-3">
                      <span className="text-xs text-gray-400 w-5 text-right">{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-900 truncate">
                            {formatPath(page.path)}
                          </span>
                          <span className="text-sm text-gray-500 ml-2 flex-shrink-0">
                            {page.views.toLocaleString()}
                          </span>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: `${(page.views / maxPageViews) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Top Referrers */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Globe size={18} /> Top Referrers
              </h2>
              {data.topReferrers.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No referral data yet.</p>
              ) : (
                <div className="space-y-3">
                  {data.topReferrers.map((ref) => (
                    <div
                      key={ref.domain}
                      className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <ArrowUpRight size={14} className="text-green-500 flex-shrink-0" />
                        <span className="text-sm text-gray-900 truncate">{ref.domain}</span>
                      </div>
                      <span className="text-sm font-medium text-gray-600 ml-2">
                        {ref.views.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <p className="text-gray-500 text-center py-12">Failed to load analytics data.</p>
      )}
    </div>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType
  label: string
  value: string
  color: 'blue' | 'green' | 'purple' | 'amber'
}) {
  const colors = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    amber: 'bg-amber-50 text-amber-600',
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className={`p-2 rounded-lg ${colors[color]}`}>
          <Icon size={18} />
        </div>
        <span className="text-sm text-gray-500">{label}</span>
      </div>
      <p className="text-2xl font-bold text-gray-900 truncate">{value}</p>
    </div>
  )
}

function formatPath(path: string): string {
  if (PATH_LABELS[path]) return PATH_LABELS[path]
  if (path.startsWith('/blog/')) return path.replace('/blog/', 'Blog: ')
  if (path.startsWith('/p/')) return path.replace('/p/', 'Page: ')
  if (path.startsWith('/team/')) return path.replace('/team/', 'Team: ')
  return path
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}
