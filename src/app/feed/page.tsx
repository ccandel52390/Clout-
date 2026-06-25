import ContentCard from "@/components/ContentCard";

// Mock data based on DATA_CONTRACT.md
const mockPicks = [
  {
    pick_id: "pick_vid_001_0_hook",
    video: {
      title: "The TRUTH about AI in 2025",
      platform: "YouTube",
      niche: "tech",
    },
    clip: {
      clip_type: "hook",
    },
    viral_probability: 85,
  },
  {
    pick_id: "pick_vid_002_1_peak",
    video: {
      title: "How to scale your business to $1M",
      platform: "YouTube",
      niche: "business",
    },
    clip: {
      clip_type: "peak_moment",
    },
    viral_probability: 72,
  },
  {
    pick_id: "pick_vid_003_0_hook",
    video: {
      title: "10 Minimalist Habits for 2025",
      platform: "YouTube",
      niche: "lifestyle",
    },
    clip: {
      clip_type: "hook",
    },
    viral_probability: 91,
  },
  {
    pick_id: "pick_vid_004_2_cta",
    video: {
      title: "The only workout you need",
      platform: "YouTube",
      niche: "fitness",
    },
    clip: {
      clip_type: "cta",
    },
    viral_probability: 45,
  },
];

export default function FeedPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-4">
        <div>
          <h1 className="text-4xl font-black mb-2 tracking-tight">DAILY FEED</h1>
          <p className="text-secondary font-medium">Hand-picked viral content for your channels.</p>
        </div>
        <div className="flex items-center gap-3">
          <select className="bg-surface border border-white/10 rounded-lg px-4 py-2 text-sm font-semibold focus:outline-none focus:border-primary">
            <option>All Niches</option>
            <option>Tech</option>
            <option>Business</option>
            <option>Lifestyle</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {mockPicks.map((pick) => (
          <ContentCard
            key={pick.pick_id}
            title={pick.video.title}
            niche={pick.video.niche}
            viralScore={pick.viral_probability}
            platform={pick.video.platform}
            type={pick.clip.clip_type}
          />
        ))}
      </div>
    </div>
  );
}
