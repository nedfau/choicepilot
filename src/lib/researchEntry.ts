export const RESEARCH_TYPES = ["Global Example", "Competitor", "Substitute"] as const;

export type ResearchType = (typeof RESEARCH_TYPES)[number];

export interface ResearchEntry {
  id: string;
  name: string;
  type: ResearchType;
  region: string | null;
  url: string | null;
  description: string;
  gap_note: string | null;
  created_at: string;
}
