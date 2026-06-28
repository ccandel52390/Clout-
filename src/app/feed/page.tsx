import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

interface ContentItem {
  id: string;
  title: string;
  description: string;
  viralScore: number;
  niche: string;
  platform: string;
  thumbnail: string;
}

const MOCK_PICKS: ContentItem[] = [
  {
    id: "1",
    title: "AI Tools that will change your life in 2026",
    description: "A deep dive into the latest AI tools that are making waves in the tech community.",
    viralScore: 94,
    niche: "Tech",
    platform: "YouTube",
    thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "2",
    title: "Why you should stop saving money (and start investing)",
    description: "Financial advice for the modern age. How to grow your wealth fast.",
    viralScore: 82,
    niche: "Finance",
    platform: "TikTok",
    thumbnail: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "3",
    title: "Top 5 hidden travel gems in Europe",
    description: "Discover the best places to visit in Europe that are still under the radar.",
    viralScore: 75,
    niche: "Travel",
    platform: "Instagram",
    thumbnail: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "4",
    title: "How to build a $10k/mo side hustle",
    description: "Step-by-step guide to starting a profitable online business.",
    viralScore: 48,
    niche: "Business",
    platform: "YouTube",
    thumbnail: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&q=80&w=800",
  },
];

function ViralScoreBadge({ score }: { score: number }) {
  let colorClass = "text-error border-error";
  if (score >= 80) colorClass = "text-success border-success";
  else if (score >= 50) colorClass = "text-warning border-warning";

  return (
    <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 bg-background font-bold ${colorClass}`}>
      {score}%
    </div>
  );
}

export default async function FeedPage() {
  const session = await auth();
  
  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <header className="mb-12">
          <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl">
            Daily <span className="text-primary">Content</span> Feed
          </h1>
          <p className="mt-4 text-xl text-text-secondary">
            AI-curated viral opportunities for your niche.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {MOCK_PICKS.map((pick) => (
            <div 
              key={pick.id} 
              className="group relative bg-surface overflow-hidden rounded-xl border border-white/5 transition-all hover:border-primary/50 hover:shadow-[0_0_20px_rgba(0,209,255,0.15)]"
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-video overflow-hidden">
                <img 
                  src={pick.thumbnail} 
                  alt={pick.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface/80 to-transparent"></div>
                
                {/* Viral Score Positioned in top-right */}
                <div className="absolute top-3 right-3 shadow-lg">
                  <ViralScoreBadge score={pick.viralScore} />
                </div>

                {/* Niche Tag */}
                <div className="absolute bottom-3 left-3">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-white/10 text-white backdrop-blur-md border border-white/10 uppercase tracking-wider">
                    {pick.niche}
                  </span>
                </div>
              </div>

              {/* Content Details */}
              <div className="p-6">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                    {pick.platform}
                  </span>
                </div>
                <h3 className="text-xl font-bold leading-tight text-white group-hover:text-primary transition-colors">
                  {pick.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-text-secondary line-clamp-2">
                  {pick.description}
                </p>
                
                <div className="mt-6 flex items-center justify-between">
                  <Link href={`/feed/${pick.id}`} className="flex-1 bg-white text-background font-black py-3 rounded-lg text-sm uppercase tracking-wider hover:bg-primary hover:text-white transition-all active:scale-95 text-center">
                    Review & Post
                  </Link>
                  <button className="ml-3 p-3 text-white/50 hover:text-white transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
