"use client";

import { useEffect, useState } from "react";
import ContentCard from "@/components/ContentCard";

export default function FeedPage() {
  const [picks, setPicks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [niche, setNiche] = useState("All Niches");

  const fetchPicks = async (currentNiche: string) => {
    setLoading(true);
    try {
      const url = currentNiche === "All Niches" 
        ? "/api/v1/picks" 
        : `/api/v1/picks?niche=${currentNiche.toLowerCase()}`;
      const res = await fetch(url);
      const json = await res.json();
      if (json.status === "ok") {
        setPicks(json.data);
      }
    } catch (error) {
      console.error("Failed to fetch picks", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPicks(niche);
  }, [niche]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl">
              Daily <span className="text-primary">Content</span> Feed
            </h1>
            <p className="mt-4 text-xl text-text-secondary">
              AI-curated viral opportunities for your niche.
            </p>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {["All Niches", "Tech", "Business", "Lifestyle", "Comedy", "Finance", "Fitness", "Gaming", "Education", "Travel", "Food", "Sports", "News", "Music", "Art", "Science", "DIY", "Fashion", "Health", "Politics"].map((n) => (
              <button
                key={n}
                onClick={() => setNiche(n)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap border ${
                  niche === n
                    ? "bg-primary text-background border-primary"
                    : "bg-surface text-text-secondary border-white/5 hover:border-white/20"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </header>

        {loading ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-video bg-white/5 rounded-xl mb-4"></div>
                <div className="h-6 bg-white/5 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-white/5 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {picks.length > 0 ? (
              picks.map((pick) => (
                <ContentCard
                  key={pick.pick_id}
                  id={pick.pick_id.replace('pick_', '')}
                  title={pick.video.title}
                  description={pick.video.description || "No description available."}
                  viralScore={Math.round(pick.viral_probability)}
                  platform={pick.video.platform}
                  niche={pick.video.niche}
                  thumbnail={pick.video.thumbnail_url || "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=800"}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-20 bg-surface rounded-2xl border border-dashed border-white/10">
                <p className="text-text-secondary font-medium">No picks found for this niche.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
