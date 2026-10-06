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

export const SCENARIO_PRESETS = {
  conservative: {
    plusSubscribers: 100,
    plusPrice: 6.99,
    campusPartners: 1,
    campusPrice: 199,
  },
  base: DEFAULT_ASSUMPTIONS,
  optimistic: {
    plusSubscribers: 2000,
    plusPrice: 6.99,
    campusPartners: 15,
    campusPrice: 199,
  },
} as const satisfies Record<string, PricingAssumptions>;

export type ScenarioPreset = keyof typeof SCENARIO_PRESETS | "custom";

export interface SegmentRevenue {
  students: RevenueResult;
  universities: RevenueResult;
}

export function computeSegmentRevenue(
  assumptions: PricingAssumptions
): SegmentRevenue {
  const studentsMonthly = assumptions.plusSubscribers * assumptions.plusPrice;
  const universitiesMonthly =
    assumptions.campusPartners * assumptions.campusPrice;

  return {
    students: {
      monthly: studentsMonthly,
      annual: studentsMonthly * 12 * (1 - ANNUAL_DISCOUNT),
    },
    universities: {
      monthly: universitiesMonthly,
      annual: universitiesMonthly * 12 * (1 - ANNUAL_DISCOUNT),
    },
  };
}

export function sanitizeAssumption(raw: string): number {
  const value = Number(raw);
  if (raw.trim() === "" || Number.isNaN(value) || value < 0) return 0;
  return value;
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
