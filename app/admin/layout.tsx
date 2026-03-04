import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin | Rise Financial Partners',
  description: 'Admin dashboard for Rise Financial Partners',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-rise-navy">Rise Admin</h1>
        </div>
        <nav className="p-4 space-y-2">
          <a href="/admin/dashboard" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
            Dashboard
          </a>
          <a href="/admin/blog" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
            Blog Posts
          </a>
          <a href="/admin/pages" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
            Pages
          </a>
          <a href="/admin/ai-assistant" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
            AI Assistant
          </a>
          <a href="/admin/compliance" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
            Compliance Queue
          </a>
          <a href="/admin/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
            My Profile
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
