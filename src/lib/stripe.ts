import Stripe from "stripe";
import { loadStripe } from "@stripe/stripe-js";

export const NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_test_viralforge_placeholder";

// Client-side Stripe loader
export const getStripe = () => loadStripe(NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

// Server-side Stripe instance
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder", {
  apiVersion: "2025-01-27.acacia" as any,
});

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
