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

export function filterResearchEntries(
  entries: ResearchEntry[],
  typeFilter: string,
  search: string
): ResearchEntry[] {
  const query = search.trim().toLowerCase();
  return entries.filter((entry) => {
    const matchesType = typeFilter === "All" || entry.type === typeFilter;
    const matchesSearch =
      query.length === 0 ||
      entry.name.toLowerCase().includes(query) ||
      entry.description.toLowerCase().includes(query);
    return matchesType && matchesSearch;
  });
}
