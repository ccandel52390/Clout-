"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const NICHES = [
  { id: "tech", name: "Technology", description: "AI, gadgets, software, and future tech.", icon: "🚀" },
  { id: "finance", name: "Finance", description: "Investing, crypto, and personal finance.", icon: "💰" },
  { id: "health", name: "Health & Fitness", description: "Workout tips, nutrition, and mental health.", icon: "💪" },
  { id: "business", name: "Business", description: "Entrepreneurship, marketing, and startups.", icon: "📈" },
  { id: "lifestyle", name: "Lifestyle", description: "Travel, fashion, and home decor.", icon: "✨" },
  { id: "gaming", name: "Gaming", description: "Latest games, e-sports, and streaming.", icon: "🎮" },
];

export default function OnboardingPage() {
  const [selected, setSelected] = useState<string[]>([]);
  const router = useRouter();

  const toggleNiche = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleComplete = () => {
    // In a real app, save selected niches to the database
    router.push("/feed");
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-center">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-white sm:text-5xl">
            Welcome to <span className="text-primary">Clout!</span>
          </h1>
          <p className="mt-4 text-xl text-text-secondary">
            Pick your niches to personalize your daily viral feed.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {NICHES.map((niche) => (
            <div
              key={niche.id}
              onClick={() => toggleNiche(niche.id)}
              className={`group cursor-pointer border-2 rounded-2xl p-6 transition-all duration-300 ${
                selected.includes(niche.id)
                  ? "border-primary bg-primary/10 shadow-[0_0_20px_rgba(0,209,255,0.1)]"
                  : "border-white/5 bg-surface hover:border-white/20"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-3xl mb-2 block">{niche.icon}</span>
                {selected.includes(niche.id) && (
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <svg className="w-4 h-4 text-background" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>
              <h3 className={`text-xl font-bold ${selected.includes(niche.id) ? "text-primary" : "text-white"}`}>
                {niche.name}
              </h3>
              <p className="mt-2 text-sm text-text-secondary">{niche.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center">
          <button
            onClick={handleComplete}
            disabled={selected.length < 2}
            className={`w-full sm:w-auto rounded-xl px-12 py-4 text-lg font-black uppercase tracking-widest transition-all ${
              selected.length < 2
                ? "bg-white/10 text-white/30 cursor-not-allowed"
                : "bg-primary text-background hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(0,209,255,0.3)]"
            }`}
          >
            {selected.length < 2 ? `Select ${2 - selected.length} more` : "Unlock My Feed"}
          </button>
          <p className="mt-4 text-sm text-text-secondary">
            You can change these later in your dashboard.
          </p>
        </div>
      </div>
    </div>
  );
}
