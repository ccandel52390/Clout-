export default function FeedPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Daily Content Feed</h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white overflow-hidden shadow rounded-lg border">
            <div className="h-48 bg-gray-200 animate-pulse"></div>
            <div className="p-5">
              <div className="flex justify-between items-center mb-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  95% Viral Score
                </span>
                <span className="text-xs text-gray-500">YouTube</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900">Viral Hook Example #{i}</h3>
              <p className="mt-2 text-sm text-gray-600">
                This is a placeholder for an AI-generated clip description.
              </p>
              <div className="mt-4 flex justify-end">
                <button className="text-indigo-600 font-semibold text-sm hover:text-indigo-500">
                  Preview & Pick
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
