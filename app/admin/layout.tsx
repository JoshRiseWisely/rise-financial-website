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
        </nav>
        <div className="p-4 mt-auto border-t border-gray-200">
          <a href="/" className="block px-4 py-2 text-sm text-gray-500 hover:text-gray-700">
            &larr; Back to Site
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
