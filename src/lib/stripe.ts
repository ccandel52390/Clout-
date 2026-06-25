// This is a placeholder for Stripe integration.
// In a real app, you'd use the 'stripe' package.

export const stripe = {
  subscriptions: {
    create: async (data: any) => {
      console.log("Mock Stripe: Creating subscription", data);
      return { id: `sub_${Math.random().toString(36).substring(7)}`, status: "active" };
    },
  },
  checkout: {
    sessions: {
      create: async (data: any) => {
        console.log("Mock Stripe: Creating checkout session", data);
        return { url: "/dashboard?stripe=success" };
      },
    },
  },
};

export const formatAmountForStripe = (amount: number, currency: string) => {
  let numberFormat = new Intl.NumberFormat(["en-US"], {
    style: "currency",
    currency: currency,
    currencyDisplay: "symbol",
  });
  const parts = numberFormat.formatToParts(amount);
  let zeroDecimalCurrency = true;
  for (let part of parts) {
    if (part.type === "decimal") {
      zeroDecimalCurrency = false;
    }
  }
  return zeroDecimalCurrency ? amount : Math.round(amount * 100);
};
