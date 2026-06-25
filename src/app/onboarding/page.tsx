"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const NICHES = [
  { id: "tech", name: "Technology", description: "AI, gadgets, software, and future tech." },
  { id: "finance", name: "Finance", description: "Investing, crypto, and personal finance." },
  { id: "health", name: "Health & Fitness", description: "Workout tips, nutrition, and mental health." },
  { id: "business", name: "Business", description: "Entrepreneurship, marketing, and startups." },
  { id: "lifestyle", name: "Lifestyle", description: "Travel, fashion, and home decor." },
  { id: "gaming", name: "Gaming", description: "Latest games, e-sports, and streaming." },
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
    router.push("/dashboard");
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900">Welcome to Clout!</h1>
        <p className="mt-4 text-lg text-gray-600">
          Pick at least 2 niches to personalize your daily content feed.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {NICHES.map((niche) => (
          <div
            key={niche.id}
            onClick={() => toggleNiche(niche.id)}
            className={`cursor-pointer border rounded-xl p-6 transition-all ${
              selected.includes(niche.id)
                ? "border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600"
                : "border-gray-200 bg-white hover:border-indigo-300"
            }`}
          >
            <h3 className="text-lg font-bold text-gray-900">{niche.name}</h3>
            <p className="mt-2 text-sm text-gray-500">{niche.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 flex justify-center">
        <button
          onClick={handleComplete}
          disabled={selected.length < 2}
          className={`rounded-md px-10 py-3 text-lg font-semibold text-white shadow-sm transition-colors ${
            selected.length < 2
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          }`}
        >
          {selected.length < 2 ? `Select ${2 - selected.length} more` : "Get Started"}
        </button>
      </div>
    </div>
  );
}
