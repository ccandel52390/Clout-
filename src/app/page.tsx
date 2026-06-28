import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] text-center px-4 bg-background relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-success/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="relative z-10 max-w-4xl">
        <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-black uppercase tracking-[0.3em] bg-white/5 border border-white/10 text-primary mb-8">
          The AI Content Factory
        </div>
        
        <h1 className="text-6xl font-black tracking-tight text-white sm:text-8xl mb-8 leading-[0.9]">
          Forge Your <br />
          <span className="text-primary italic">Viral</span> Presence
        </h1>
        
        <p className="max-w-2xl mx-auto text-xl text-text-secondary mb-12 leading-relaxed">
          Clout uses advanced AI to scan, clip, and score the highest-potential content for your niche. Ready-to-post clips delivered daily.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
          <Link
            href="/auth/signin"
            className="w-full sm:w-auto rounded-xl bg-primary px-10 py-5 text-lg font-black uppercase tracking-widest text-background shadow-[0_0_40px_rgba(0,209,255,0.3)] hover:scale-105 active:scale-95 transition-all"
          >
            Start For Free
          </Link>
          <Link
            href="/pricing"
            className="w-full sm:w-auto rounded-xl bg-white/5 px-10 py-5 text-lg font-black uppercase tracking-widest text-white border border-white/10 hover:bg-white/10 transition-all"
          >
            View Pricing
          </Link>
        </div>

        <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
          <div className="flex items-center justify-center font-black text-xl italic tracking-tighter text-white">TIKTOK</div>
          <div className="flex items-center justify-center font-black text-xl italic tracking-tighter text-white">YOUTUBE</div>
          <div className="flex items-center justify-center font-black text-xl italic tracking-tighter text-white">INSTAGRAM</div>
          <div className="flex items-center justify-center font-black text-xl italic tracking-tighter text-white">X / TWITTER</div>
        </div>
      </div>
    </div>
  );
}
