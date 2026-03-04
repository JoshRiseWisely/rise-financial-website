'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, FileText, BookOpen, User, LogOut, ArrowLeft, ClipboardCheck, BarChart3 } from 'lucide-react'

const NAV_ITEMS = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/blog', label: 'Blog Posts', icon: BookOpen },
  { href: '/admin/pages', label: 'Pages', icon: FileText },
  { href: '/admin/compliance', label: 'Compliance', icon: ClipboardCheck, requiresCompliance: true },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3, requiresAdmin: true },
  { href: '/admin/profile', label: 'My Profile', icon: User },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [userRole, setUserRole] = useState<string | null>(null)

  useEffect(() => {
    async function fetchRole() {
      try {
        const res = await fetch('/api/auth/me')
        if (res.ok) {
          const { user } = await res.json()
          setUserRole(user.role)
        }
      } catch {
        // ignore — sidebar still works, just won't show compliance link
      }
    }
    fetchRole()
  }, [])

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  const visibleItems = NAV_ITEMS.filter((item) => {
    if ('requiresAdmin' in item && item.requiresAdmin) {
      return userRole === 'admin'
    }
    if ('requiresCompliance' in item && item.requiresCompliance) {
      return userRole === 'admin' || userRole === 'compliance'
    }
    return true
  })

  return (
    <aside className="w-64 bg-white border-r border-gray-200 shadow-sm flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-rise-navy">Rise Admin</h1>
      </div>

      <nav className="p-4 space-y-1 flex-1">
        {visibleItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-rise-navy/10 text-rise-navy'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-gray-200 space-y-1">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Site
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-500 hover:text-red-600 transition-colors w-full text-left"
        >
          <LogOut size={16} />
          Log Out
        </button>
      </div>
    </aside>
  )
}
