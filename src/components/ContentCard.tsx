import Link from "next/link";
import Image from "next/image";

interface ContentCardProps {
  id: string;
  title: string;
  description: string;
  viralScore: number;
  niche: string;
  platform: string;
  thumbnail: string;
}

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

export default function ContentCard({ 
  id, 
  title, 
  description, 
  viralScore, 
  niche, 
  platform, 
  thumbnail 
}: ContentCardProps) {
  return (
    <div className="group relative bg-surface overflow-hidden rounded-xl border border-white/5 transition-all hover:border-primary/50 hover:shadow-[0_0_20px_rgba(0,209,255,0.15)] flex flex-col h-full">
      {/* Thumbnail Container */}
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={thumbnail} 
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface/80 to-transparent"></div>
        
        {/* Viral Score Positioned in top-right */}
        <div className="absolute top-3 right-3 shadow-lg">
          <ViralScoreBadge score={viralScore} />
        </div>

        {/* Niche Tag */}
        <div className="absolute bottom-3 left-3">
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-white/10 text-white backdrop-blur-md border border-white/10 uppercase tracking-wider">
            {niche}
          </span>
        </div>
      </div>

      {/* Content Details */}
      <div className="p-6 flex flex-col flex-1">
        <div className="flex justify-between items-center mb-3">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
            {platform}
          </span>
        </div>
        <h3 className="text-xl font-bold leading-tight text-white group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-text-secondary line-clamp-2">
          {description}
        </p>
        
        <div className="mt-auto pt-6 flex items-center justify-between">
          <Link href={`/feed/${id}`} className="flex-1 bg-white text-background font-black py-3 rounded-lg text-sm uppercase tracking-wider hover:bg-primary hover:text-white transition-all active:scale-95 text-center">
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
  );
}
