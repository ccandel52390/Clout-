export default function PricingPage() {
  const tiers = [
    {
      name: "Free",
      price: "$0",
      description: "Basic features for individuals.",
      features: ["3-5 daily picks", "Watermarked clips", "Basic niches"],
      buttonText: "Start for Free",
      active: false,
    },
    {
      name: "Pro",
      price: "$29",
      description: "More power for creators.",
      features: ["15 daily picks", "No watermark", "All niches", "Priority scanning"],
      buttonText: "Upgrade to Pro",
      active: true,
    },
    {
      name: "Team",
      price: "$79",
      description: "Advanced tools for small teams.",
      features: ["Unlimited picks", "No watermark", "Analytics", "Auto-posting", "Multiple accounts"],
      buttonText: "Contact Sales",
      active: false,
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h1 className="text-4xl font-black text-white sm:text-6xl tracking-tight">
            Scale Your <span className="text-primary">Clout</span>
          </h1>
          <p className="mt-6 text-xl text-text-secondary max-w-2xl mx-auto">
            Choose the plan that fits your content creation needs. No hidden fees.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 items-center">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`flex flex-col rounded-3xl p-8 bg-surface border transition-all duration-300 ${
                tier.active 
                  ? "border-primary shadow-[0_0_40px_rgba(0,209,255,0.2)] scale-105 z-10" 
                  : "border-white/5 hover:border-white/20"
              }`}
            >
              <h3 className="text-2xl font-black text-white uppercase tracking-wider">{tier.name}</h3>
              <p className="mt-4 text-text-secondary text-sm leading-relaxed">{tier.description}</p>
              <div className="mt-8 flex items-baseline">
                <span className="text-5xl font-black text-white">{tier.price}</span>
                <span className="ml-2 text-text-secondary text-lg">/mo</span>
              </div>
              
              <ul className="mt-10 space-y-5 flex-1">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <div className="bg-success/20 p-1 rounded-full shrink-0">
                      <svg className="h-4 w-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="ml-3 text-sm text-text-secondary font-medium">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button
                className={`mt-10 block w-full rounded-xl py-4 text-center text-sm font-black uppercase tracking-widest transition-all ${
                  tier.active
                    ? "bg-primary text-background hover:opacity-90 shadow-lg shadow-primary/20"
                    : "bg-white/5 text-white hover:bg-white/10"
                }`}
              >
                {tier.buttonText}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-24 text-center">
          <p className="text-text-secondary">
            Need something custom? <a href="#" className="text-primary font-bold hover:underline">Contact us</a> for enterprise options.
          </p>
        </div>
      </div>
    </div>
  );
}
