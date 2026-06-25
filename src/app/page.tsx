import Link from "next/link";

export default function Home() {
  return (
    <div className="relative isolate overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:px-8 lg:py-40">
        <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl lg:flex-shrink-0 lg:pt-8">
          <div className="mt-24 sm:mt-32 lg:mt-16">
            <a href="#" className="inline-flex space-x-6">
              <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold leading-6 text-primary ring-1 ring-inset ring-primary/20">
                What's new
              </span>
              <span className="inline-flex items-center space-x-2 text-sm font-medium leading-6 text-secondary">
                <span>Just shipped v1.0</span>
              </span>
            </a>
          </div>
          <h1 className="mt-10 text-4xl font-black tracking-tight text-white sm:text-6xl uppercase italic">
            Forge Your <span className="text-primary">Viral</span> Future
          </h1>
          <p className="mt-6 text-lg leading-8 text-secondary">
            Clout continuously scans social media for trending hooks and moments. 
            Our AI clips, scores, and prepares posts for you. One click to publish.
          </p>
          <div className="mt-10 flex items-center gap-x-6">
            <Link
              href="/auth/signin"
              className="btn-primary px-8 py-4 text-lg"
            >
              Get Started
            </Link>
            <Link href="/pricing" className="text-sm font-semibold leading-6 text-white hover:text-primary transition-colors">
              View Pricing <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
        <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-32">
          <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
            {/* Placeholder for Hero Image / App Mockup */}
            <div className="rounded-xl bg-white/5 p-2 ring-1 ring-inset ring-white/10 lg:-m-4 lg:rounded-2xl lg:p-4">
              <div className="w-[400px] h-[300px] bg-surface border border-white/10 rounded-lg flex items-center justify-center text-white/5 font-black text-4xl italic">
                CLOUT DASHBOARD
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
