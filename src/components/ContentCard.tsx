import Image from "next/image";

interface ContentCardProps {
  title: string;
  niche: string;
  viralScore: number;
  platform: string;
  thumbnail?: string;
  type: string;
}

export default function ContentCard({ title, niche, viralScore, platform, thumbnail, type }: ContentCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-viral-high border-viral-high/20 bg-viral-high/10";
    if (score >= 50) return "text-viral-medium border-viral-medium/20 bg-viral-medium/10";
    return "text-viral-low border-viral-low/20 bg-viral-low/10";
  };

  return (
    <div className="card group border border-white/5 hover:border-primary/30 transition-all duration-300">
      <div className="relative aspect-video mb-4 overflow-hidden rounded-lg bg-white/5">
        {thumbnail ? (
          <Image src={thumbnail} alt={title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/10 italic">
            No Preview
          </div>
        )}
        <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-bold border ${getScoreColor(viralScore)}`}>
          {viralScore}% Viral
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
          {niche}
        </span>
        <span className="px-2 py-0.5 rounded-full bg-white/5 text-secondary text-[10px] font-bold uppercase tracking-wider">
          {platform}
        </span>
        <span className="px-2 py-0.5 rounded-full bg-white/5 text-secondary text-[10px] font-bold uppercase tracking-wider">
          {type}
        </span>
      </div>

      <h3 className="text-lg font-semibold line-clamp-2 mb-4 group-hover:text-primary transition-colors">
        {title}
      </h3>

      <div className="flex items-center justify-between mt-auto">
        <button className="text-sm font-bold text-secondary hover:text-white transition-colors">
          View Detail
        </button>
        <button className="btn-primary py-1.5 px-4 text-sm">
          Post Now
        </button>
      </div>
    </div>
  );
}
