"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PicksTrendChart, NicheBreakdownChart } from "@/components/AnalyticsChart";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  CheckCircle2, 
  Layers,
  ArrowRight
} from "lucide-react";

interface AnalyticsData {
  summary: { name: string; value: number; unit: string }[];
  nicheStats: { name: string; count: number }[];
  picksTrend: { date: string; count: number }[];
  platformStats: { platform: string; count: number }[];
}

export default function DashboardPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const res = await fetch("/api/v1/analytics");
        const json = await res.json();
        if (json.status === "ok") {
          setData(json.data);
        }
      } catch (error) {
        console.error("Failed to fetch analytics", error);
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-48 bg-white/5 rounded mb-4"></div>
          <div className="h-4 w-64 bg-white/5 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-black text-white">Your <span className="text-primary">Dashboard</span></h1>
            <p className="mt-2 text-text-secondary text-lg">Real-time performance and content metrics.</p>
          </div>
          <Link href="/feed" className="bg-primary text-background px-6 py-3 rounded-xl font-bold hover:opacity-90 transition-all flex items-center gap-2">
            Explore Feed <ArrowRight size={18} />
          </Link>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {data?.summary.map((stat, i) => (
            <div key={stat.name} className="rounded-2xl p-6 bg-surface border border-white/5 hover:border-primary/20 transition-all">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xs font-black uppercase tracking-widest text-text-secondary">
                  {stat.name}
                </h2>
                {i === 0 && <Layers className="text-primary" size={16} />}
                {i === 1 && <TrendingUp className="text-success" size={16} />}
                {i === 2 && <CheckCircle2 className="text-warning" size={16} />}
              </div>
              <div className="flex items-baseline gap-2">
                <p className="text-4xl font-black text-white">{stat.value}</p>
                <p className="text-sm text-text-secondary">{stat.unit}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Picks Trend Chart */}
          <div className="bg-surface border border-white/5 rounded-3xl p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-bold text-white">Picks Over Time</h3>
                <p className="text-sm text-text-secondary">Picks generated and collected last 7 days.</p>
              </div>
              <BarChart3 className="text-primary/50" />
            </div>
            {data?.picksTrend && data.picksTrend.length > 0 ? (
              <PicksTrendChart data={data.picksTrend} />
            ) : (
              <div className="h-[300px] flex items-center justify-center border border-dashed border-white/10 rounded-2xl">
                <p className="text-text-secondary">Insufficient data for trend chart.</p>
              </div>
            )}
          </div>

          {/* Niche Breakdown */}
          <div className="bg-surface border border-white/5 rounded-3xl p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-bold text-white">Niche Distribution</h3>
                <p className="text-sm text-text-secondary">Content volume across your categories.</p>
              </div>
              <Users className="text-primary/50" />
            </div>
            {data?.nicheStats && data.nicheStats.length > 0 ? (
              <NicheBreakdownChart data={data.nicheStats} />
            ) : (
              <div className="h-[300px] flex items-center justify-center border border-dashed border-white/10 rounded-2xl">
                <p className="text-text-secondary">No niche data available.</p>
              </div>
            )}
          </div>
        </div>

        {/* Platform Breakdown Section */}
        <div className="bg-surface border border-white/5 rounded-3xl p-8">
            <h3 className="text-xl font-bold text-white mb-6">Content by Platform</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {data?.platformStats.map((p) => (
                    <div key={p.platform} className="bg-background/50 border border-white/5 rounded-2xl p-4 text-center">
                        <p className="text-xs font-black uppercase text-text-secondary mb-1">{p.platform || 'Other'}</p>
                        <p className="text-2xl font-black text-white">{p.count}</p>
                    </div>
                ))}
                {(!data?.platformStats || data.platformStats.length === 0) && (
                    <div className="col-span-4 py-4 text-center text-text-secondary">No platform data available.</div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}
