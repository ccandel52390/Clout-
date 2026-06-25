import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] text-center px-4">
      <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl mb-6">
        Forge Your <span className="text-indigo-600">Viral</span> Presence
      </h1>
      <p className="max-w-2xl text-xl text-gray-600 mb-10">
        Clout uses AI to scan, clip, and score the best content for your niche. 
        Ready to post clips delivered daily to your dashboard.
      </p>
      <div className="flex space-x-4">
        <Link
          href="/auth/signin"
          className="rounded-md bg-indigo-600 px-6 py-3 text-lg font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Get Started
        </Link>
        <Link
          href="/pricing"
          className="rounded-md bg-white px-6 py-3 text-lg font-semibold text-indigo-600 shadow-sm ring-1 ring-inset ring-indigo-300 hover:bg-gray-50"
        >
          View Pricing
        </Link>
      </div>
    </div>
  );
}
