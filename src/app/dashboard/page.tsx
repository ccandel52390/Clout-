import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();
  if (!session) {
    redirect("/auth/signin");
  }

  const stats = [
    { name: "Active Plan", value: "Free Tier", detail: "3 picks left today", color: "text-primary", bg: "bg-primary/10", border: "border-primary/20" },
    { name: "Total Published", value: "12", detail: "Avg. 88% Viral Score", color: "text-success", bg: "bg-success/10", border: "border-success/20" },
    { name: "Niches Followed", value: "2", detail: "Tech, Finance", color: "text-warning", bg: "bg-warning/10", border: "border-warning/20" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-4xl font-black text-white">Your <span className="text-primary">Dashboard</span></h1>
            <p className="mt-2 text-text-secondary text-lg">Performance and account overview.</p>
          </div>
          <Link href="/feed" className="hidden sm:block bg-surface border border-white/10 text-white px-6 py-3 rounded-xl font-bold hover:bg-white/5 transition-colors">
            Go to Feed
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {stats.map((stat) => (
            <div key={stat.name} className={`rounded-2xl p-6 bg-surface border ${stat.border}`}>
              <h2 className={`text-xs font-black uppercase tracking-widest ${stat.color} mb-1`}>
                {stat.name}
              </h2>
              <p className="text-3xl font-black text-white">{stat.value}</p>
              <p className="text-sm text-text-secondary mt-2">{stat.detail}</p>
            </div>
          ))}
        </div>

        <div className="bg-surface border border-white/5 rounded-3xl p-8 sm:p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 bg-background rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/10">
              <svg className="w-10 h-10 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">No recent picks yet</h2>
            <p className="text-text-secondary mb-8 leading-relaxed">
              Start exploring the Daily Feed to find high-potential content and grow your social presence.
            </p>
            <Link href="/feed" className="inline-block bg-primary text-background font-black px-10 py-4 rounded-xl uppercase tracking-widest hover:scale-105 transition-transform">
              Find Content
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
