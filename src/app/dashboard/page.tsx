export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">User Dashboard</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border rounded-md p-4 bg-indigo-50">
            <h2 className="text-sm font-semibold text-indigo-700 uppercase tracking-wider mb-1">
              Active Plan
            </h2>
            <p className="text-2xl font-bold text-indigo-900">Free Tier</p>
            <p className="text-sm text-indigo-600 mt-2">3 picks left today</p>
          </div>
          <div className="border rounded-md p-4 bg-green-50">
            <h2 className="text-sm font-semibold text-green-700 uppercase tracking-wider mb-1">
              Total Published
            </h2>
            <p className="text-2xl font-bold text-green-900">12</p>
          </div>
          <div className="border rounded-md p-4 bg-blue-50">
            <h2 className="text-sm font-semibold text-blue-700 uppercase tracking-wider mb-1">
              Niches
            </h2>
            <p className="text-2xl font-bold text-blue-900">2</p>
          </div>
        </div>
        
        <div className="mt-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Your Recent Picks</h2>
          <p className="text-gray-500 italic">No picks yet. Head to the feed to find content!</p>
        </div>
      </div>
    </div>
  );
}
