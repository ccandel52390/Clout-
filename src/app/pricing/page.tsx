export default function PricingPage() {
  const tiers = [
    {
      name: "Free",
      price: "$0",
      description: "Basic features for individuals.",
      features: ["3-5 daily picks", "Watermarked clips", "Basic niches"],
      buttonText: "Start for Free",
      active: true,
    },
    {
      name: "Pro",
      price: "$29",
      description: "More power for creators.",
      features: ["15 daily picks", "No watermark", "All niches", "Priority scanning"],
      buttonText: "Upgrade to Pro",
      active: false,
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
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
          Simple, Transparent Pricing
        </h1>
        <p className="mt-4 text-xl text-gray-600">
          Choose the plan that fits your content creation needs.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {tiers.map((tier) => (
          <div
            key={tier.name}
            className={`flex flex-col border rounded-2xl p-8 bg-white shadow-sm ${
              tier.name === "Pro" ? "ring-2 ring-indigo-600" : ""
            }`}
          >
            <h3 className="text-2xl font-bold text-gray-900">{tier.name}</h3>
            <p className="mt-4 text-gray-500">{tier.description}</p>
            <p className="mt-6">
              <span className="text-4xl font-extrabold text-gray-900">{tier.price}</span>
              <span className="text-base font-medium text-gray-500">/mo</span>
            </p>
            <ul className="mt-8 space-y-4 flex-1">
              {tier.features.map((feature) => (
                <li key={feature} className="flex items-start">
                  <svg
                    className="h-6 w-6 text-green-500 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="ml-3 text-gray-600">{feature}</span>
                </li>
              ))}
            </ul>
            <button
              className={`mt-10 block w-full rounded-md px-4 py-2 text-center text-sm font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                tier.name === "Pro"
                  ? "bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:outline-indigo-600"
                  : "bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
              }`}
            >
              {tier.buttonText}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
