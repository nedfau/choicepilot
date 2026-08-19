// Simulated (rule-based) decision-core extraction. No AI/LLM call — see the
// "core-extraction-v1" prompt library entry on /docs for the documented logic.

export const PRIORITY_KEYWORDS = [
  "price",
  "cost",
  "budget",
  "time",
  "speed",
  "quality",
  "comfort",
  "safety",
  "commute",
  "distance",
  "location",
  "coverage",
  "flexibility",
  "convenience",
  "reliability",
  "support",
] as const;

const MAX_RESULTS = 8;
const MAX_OPTION_LENGTH = 60;
const LEADING_ARTICLE = /^(a|an|the)\s+/i;

function cleanSegment(segment: string): string {
  return segment.trim().replace(LEADING_ARTICLE, "").trim();
}

function dedupe(values: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const value of values) {
    const key = value.toLowerCase();
    if (!seen.has(key) && value.length > 0) {
      seen.add(key);
      result.push(value);
    }
  }
  return result;
}

export function extractOptions(text: string): string[] {
  const betweenMatch = text.match(/\bbetween\s+([^,.;!?]+)/i);
  const source = betweenMatch ? betweenMatch[1] : text;
  const splitPattern = betweenMatch
    ? /\s*,\s*|\s+vs\.?\s+|\s+or\s+|\s+and\s+/i
    : /\s*,\s*|\s+vs\.?\s+|\s+or\s+/i;

  const segments = source
    .split(splitPattern)
    .map(cleanSegment)
    .filter((s) => s.length > 1 && s.length <= MAX_OPTION_LENGTH);

  return dedupe(segments).slice(0, MAX_RESULTS);
}

export function extractPriorities(text: string): string[] {
  const matches = PRIORITY_KEYWORDS.filter((keyword) =>
    new RegExp(`\\b${keyword}\\b`, "i").test(text)
  ).map((keyword) => keyword[0].toUpperCase() + keyword.slice(1));

  return matches.slice(0, MAX_RESULTS);
}

export interface ExtractedCore {
  options: string[];
  priorities: string[];
}

export function extractCore(text: string): ExtractedCore {
  return {
    options: extractOptions(text),
    priorities: extractPriorities(text),
  };
}
