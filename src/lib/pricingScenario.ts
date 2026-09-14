export type BillingPeriod = "monthly" | "annual";

export const ANNUAL_DISCOUNT = 0.15;

export interface PricingAssumptions {
  plusSubscribers: number;
  plusPrice: number;
  campusPartners: number;
  campusPrice: number;
}

export const DEFAULT_ASSUMPTIONS: PricingAssumptions = {
  plusSubscribers: 500,
  plusPrice: 6.99,
  campusPartners: 4,
  campusPrice: 199,
};

export interface RevenueResult {
  monthly: number;
  annual: number;
}

export function computeRevenue(assumptions: PricingAssumptions): RevenueResult {
  const monthly =
    assumptions.plusSubscribers * assumptions.plusPrice +
    assumptions.campusPartners * assumptions.campusPrice;
  const annual = monthly * 12 * (1 - ANNUAL_DISCOUNT);
  return { monthly, annual };
}

export interface PricingScenario {
  id: string;
  plus_subscribers: number;
  plus_price: number;
  campus_partners: number;
  campus_price: number;
  billing_period: BillingPeriod;
  monthly_revenue: number;
  annual_revenue: number;
  created_at: string;
}
