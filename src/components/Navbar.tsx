import Link from "next/link";
import { auth, signOut } from "@/lib/auth";

export default async function Navbar() {
  const session = await auth();

  return (
    <nav className="border-b border-surface bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-primary">
              Clout
            </Link>
            <div className="ml-10 flex items-baseline space-x-4">
              <Link href="/feed" className="text-text-secondary hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Feed
              </Link>
              <Link href="/dashboard" className="text-text-secondary hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Dashboard
              </Link>
              <Link href="/pricing" className="text-text-secondary hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Pricing
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {session ? (
              <>
                <span className="text-sm text-text-secondary">{session.user?.email}</span>
                <form
                  action={async () => {
                    "use server";
                    await signOut();
                  }}
                >
                  <button className="bg-primary text-background px-4 py-2 rounded-md text-sm font-bold hover:opacity-90 transition-opacity">
                    Sign Out
                  </button>
                </form>
              </>
            ) : (
              <Link href="/auth/signin" className="bg-primary text-background px-4 py-2 rounded-md text-sm font-bold hover:opacity-90 transition-opacity">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
