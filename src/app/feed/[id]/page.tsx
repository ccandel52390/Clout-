"use client";
import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

// Mock data fetch for the detail view
const GET_MOCK_DETAIL = (id: string) => ({
  id,
  title: "AI Tools that will change your life in 2026",
  description: "A deep dive into the latest AI tools that are making waves in the tech community.",
  viralScore: 94,
  breakdown: {
    hook: 98,
    retention: 92,
    trend: 95,
    engagement: 89
  },
  niche: "Tech",
  platform: "YouTube",
  thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800",
  videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Just a placeholder
  caption: "This AI tool changes EVERYTHING 🚀 I tested 50 AI tools so you don't have to. The future of AI is here 🔥 #tech #ai #future #innovation #viral #trending",
});

export default function ContentDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const data = GET_MOCK_DETAIL(id);
  
  const [caption, setCaption] = useState(data.caption);
  const [isPublishing, setIsPublishing] = useState(false);

  const handlePublish = () => {
    setIsPublishing(true);
    setTimeout(() => {
      alert("Published successfully!");
      setIsPublishing(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Link href="/feed" className="inline-flex items-center text-primary mb-8 hover:underline">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Feed
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column: Video Preview */}
          <div>
            <div className="relative aspect-video bg-black rounded-3xl overflow-hidden border border-white/5 shadow-2xl">
              <div className="absolute inset-0 flex items-center justify-center bg-surface">
                <p className="text-text-secondary">Video Player Placeholder</p>
                <div className="absolute inset-0 bg-cover bg-center opacity-50" style={{ backgroundImage: `url(${data.thumbnail})` }}></div>
                <button className="relative z-10 w-20 h-20 bg-primary/90 text-background rounded-full flex items-center justify-center pl-1 hover:scale-110 transition-transform">
                  <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="mt-8 bg-surface rounded-3xl p-8 border border-white/5">
              <h2 className="text-xl font-black text-white mb-6 uppercase tracking-widest">Viral Score Analysis</h2>
              <div className="space-y-6">
                {Object.entries(data.breakdown).map(([key, value]) => (
                  <div key={key}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-text-secondary capitalize font-bold">{key.replace('_', ' ')}</span>
                      <span className="text-white font-black">{value}%</span>
                    </div>
                    <div className="h-2 bg-background rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${value >= 80 ? 'bg-success' : value >= 50 ? 'bg-warning' : 'bg-error'}`}
                        style={{ width: `${value}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 p-4 bg-primary/5 rounded-xl border border-primary/10">
                <p className="text-sm text-text-secondary leading-relaxed italic">
                  "This clip has a high hook strength due to the controversial opening statement. Retention is predicted to be strong as the value is delivered early."
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Edit & Post */}
          <div className="flex flex-col">
            <div className="bg-surface rounded-3xl p-8 border border-white/5 flex-1">
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-black uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-md">
                  {data.platform}
                </span>
                <div className="text-right">
                  <span className="block text-[10px] text-text-secondary uppercase font-black tracking-widest">Viral Score</span>
                  <span className="text-3xl font-black text-success">{data.viralScore}%</span>
                </div>
              </div>

              <h1 className="text-3xl font-black text-white mb-4 leading-tight">{data.title}</h1>
              <p className="text-text-secondary mb-8 leading-relaxed">{data.description}</p>

              <div className="mb-8">
                <label className="block text-xs font-black text-white uppercase tracking-widest mb-3">
                  Edit Caption
                </label>
                <textarea 
                  className="w-full h-48 bg-background border border-white/10 rounded-2xl p-4 text-white text-sm focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none resize-none leading-relaxed"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-4 bg-background border border-white/5 rounded-2xl">
                  <span className="block text-[10px] text-text-secondary uppercase font-black tracking-widest mb-1">Niche</span>
                  <span className="text-white font-bold">{data.niche}</span>
                </div>
                <div className="p-4 bg-background border border-white/5 rounded-2xl">
                  <span className="block text-[10px] text-text-secondary uppercase font-black tracking-widest mb-1">Estimated Reach</span>
                  <span className="text-white font-bold">12k - 45k</span>
                </div>
              </div>

              <button 
                onClick={handlePublish}
                disabled={isPublishing}
                className={`w-full py-5 rounded-2xl text-lg font-black uppercase tracking-widest transition-all ${
                  isPublishing 
                    ? "bg-white/10 text-white/30 cursor-not-allowed"
                    : "bg-primary text-background hover:scale-105 shadow-[0_0_40px_rgba(0,209,255,0.3)] active:scale-95"
                }`}
              >
                {isPublishing ? "Publishing..." : "Post to Social"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
