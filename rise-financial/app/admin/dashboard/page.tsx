export default function Dashboard() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-gray-600 mt-2">Welcome to Rise Financial Partners Admin</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Stats Cards */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-600 text-sm font-medium">Blog Posts</h3>
          <p className="text-3xl font-bold text-rise-navy mt-2">0</p>
          <p className="text-gray-500 text-sm mt-1">Published</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-600 text-sm font-medium">Pending Approvals</h3>
          <p className="text-3xl font-bold text-rise-gold mt-2">0</p>
          <p className="text-gray-500 text-sm mt-1">Awaiting review</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-600 text-sm font-medium">AI Generations</h3>
          <p className="text-3xl font-bold text-rise-navy mt-2">0</p>
          <p className="text-gray-500 text-sm mt-1">This month</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-600 text-sm font-medium">Team Members</h3>
          <p className="text-3xl font-bold text-rise-navy mt-2">4</p>
          <p className="text-gray-500 text-sm mt-1">Active users</p>
        </div>
      </div>

      <div className="mt-8 bg-blue-50 border border-blue-200 p-4 rounded-lg">
        <p className="text-blue-900">
          <strong>System Status:</strong> Database and authentication configured. Ready for content creation.
        </p>
      </div>
    </div>
  )
}
