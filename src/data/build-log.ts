// Generated from `git log --reverse --format="%h|%ad|%s" --date=short` on
// 2026-11-06, at commit 0e4a0d3. Week grouping is exact for every entry
// except the two marked `inferredWeek: true` — those two follow-up commits
// weren't made under a prompt that restated "Week N," so the grouping there
// is inferred from which page/module the commit continued, not from an
// explicit label.

export interface BuildLogEntry {
  hash: string;
  date: string;
  message: string;
  /** The page/route this commit introduced for the first time, if any. */
  page: string | null;
  /** True if this commit's week grouping is inferred rather than explicit. */
  inferredWeek?: boolean;
}

export interface BuildLogWeek {
  week: string;
  title: string;
  entries: BuildLogEntry[];
}

export const BUILD_LOG: BuildLogWeek[] = [
  {
    week: "Week 0",
    title: "Infrastructure",
    entries: [
      { hash: "25b8bd6", date: "2026-08-19", message: "Initial commit from Create Next App", page: null },
      { hash: "4cb6bab", date: "2026-08-19", message: "Add homepage hero and how-it-works sections", page: "/" },
      { hash: "e929104", date: "2026-08-19", message: "Add navbar, footer, and roadmap section", page: null },
      { hash: "06a493f", date: "2026-08-19", message: "Add docs page and Supabase client placeholder", page: "/docs" },
      { hash: "3b47cd7", date: "2026-08-19", message: "Add project README", page: null },
    ],
  },
  {
    week: "Week 1",
    title: "Core Extraction",
    entries: [
      { hash: "3438b92", date: "2026-08-19", message: "Add core extraction route handler", page: null },
      { hash: "3da7b10", date: "2026-08-19", message: "Add /core intake form", page: "/core" },
      { hash: "42b0f7f", date: "2026-08-19", message: "Add labeled Simulated output card", page: null },
      { hash: "798db5c", date: "2026-08-19", message: "Add Supabase save for core outputs", page: null },
      { hash: "dc01799", date: "2026-08-19", message: "Add recent entries dashboard preview", page: null },
      { hash: "d8d8ef8", date: "2026-08-19", message: "Document core extraction as a prompt library entry", page: "/docs" },
    ],
  },
  {
    week: "Week 2",
    title: "Research & Benchmarking",
    entries: [
      { hash: "97329f4", date: "2026-08-31", message: "Add /research page skeleton", page: "/research" },
      { hash: "cf32edf", date: "2026-08-31", message: "Add research intake form", page: null },
      { hash: "91ee379", date: "2026-08-31", message: "Add research save route handler", page: null },
      { hash: "3b737a7", date: "2026-08-31", message: "Add research table with filter and search", page: null },
      { hash: "e5bfdbd", date: "2026-08-31", message: "Add risk map section", page: null },
      { hash: "26da956", date: "2026-09-02", message: "Add 'Research' link to Navbar component", page: null },
      { hash: "c01ed46", date: "2026-09-28", message: "Add dashboard summary widget and benchmark cards view to /research", page: null },
      { hash: "d342fb9", date: "2026-09-28", message: "Swap /research dashboard stat to Region = Mexico count", page: null },
      { hash: "514a2d1", date: "2026-09-28", message: "Reposition /research dashboard widget and view toggle", page: null },
    ],
  },
  {
    week: "Week 3",
    title: "Product + Pricing Simulator",
    entries: [
      { hash: "b05d4de", date: "2026-09-14", message: "Add /product tier comparison and pricing calculator lib", page: "/product" },
      { hash: "e847232", date: "2026-09-14", message: "Add /pricing skeleton with assumptions form", page: "/pricing" },
      { hash: "e79a8df", date: "2026-09-14", message: "Add live revenue calculator to /pricing", page: null },
      { hash: "f768b67", date: "2026-09-14", message: "Add pricing scenario save route and Save button", page: null },
      { hash: "09db3d0", date: "2026-09-14", message: "Add saved scenarios list to /pricing", page: null },
      { hash: "ffdd536", date: "2026-09-14", message: "Surface Research, Product, and Pricing in navigation", page: null },
      { hash: "74b1a1b", date: "2026-10-06", message: "Add Customer segments section to /product", page: null },
      { hash: "f1eacf0", date: "2026-10-06", message: "Replace /pricing assumptions panel with an Assumptions table", page: null },
      { hash: "a055c38", date: "2026-10-06", message: "Add scenario toggle and revenue-by-segment breakdown to /pricing", page: null },
      { hash: "ad6d4bb", date: "2026-10-07", message: "Show annual discount comparison on /pricing", page: null, inferredWeek: true },
    ],
  },
  {
    week: "Week 4",
    title: "Marketing Engine + Content System",
    entries: [
      { hash: "c7fc810", date: "2026-10-11", message: "Add Week 4 Supabase schema SQL", page: null },
      { hash: "c94f3f6", date: "2026-10-11", message: "Add /marketing skeleton with brand system, persona and landing copy", page: "/marketing" },
      { hash: "86cdcb7", date: "2026-10-11", message: "Add social post and video script cards to /marketing", page: null },
      { hash: "ca3ee12", date: "2026-10-11", message: "Add campaign calendar table with export and copy to /marketing", page: null },
      { hash: "e99ed62", date: "2026-10-11", message: "Add A/B tester with vote API routes to /marketing", page: null },
      { hash: "b6fd2d4", date: "2026-10-11", message: "Add Save button and saved-assets list to /marketing", page: null },
      { hash: "2325e5b", date: "2026-10-11", message: "Upgrade homepage into a full product landing page", page: null },
      { hash: "86389cf", date: "2026-10-11", message: "Add Marketing to navbar and update homepage roadmap", page: null },
    ],
  },
  {
    week: "Week 5",
    title: "Public Chatbot / Guided Assistant",
    entries: [
      { hash: "920cf35", date: "2026-10-29", message: "Add Week 5 Supabase schema SQL", page: null },
      { hash: "49fcf70", date: "2026-11-02", message: "Add rule-based chat logic and guardrails", page: null },
      { hash: "041946f", date: "2026-11-02", message: "Add /chat page with message UI and intake flow", page: "/chat" },
      { hash: "49eb0c8", date: "2026-11-02", message: "Add guardrail card, human checkpoint and session saving", page: null },
      { hash: "ff05393", date: "2026-11-02", message: "Add thumbs up/down rating with comment", page: null },
      { hash: "fe2f193", date: "2026-11-02", message: "Add external test log to /chat", page: null },
      { hash: "0b3b4b9", date: "2026-11-02", message: "Add Chat to navbar and update homepage roadmap", page: null },
      { hash: "8b08124", date: "2026-11-02", message: "Fix medical guardrail to catch common health messages", page: null, inferredWeek: true },
    ],
  },
  {
    week: "Week 6",
    title: "Integrated Venture Site",
    entries: [
      { hash: "458678a", date: "2026-11-05", message: "Add Week 6 demo tests schema SQL", page: null },
      { hash: "adb3176", date: "2026-11-05", message: "Add read-only dashboard API", page: null },
      { hash: "88271ce", date: "2026-11-05", message: "Add /dashboard page with records from all modules", page: "/dashboard" },
      { hash: "48d299c", date: "2026-11-05", message: "Add /demo page with guided walkthrough", page: "/demo" },
      { hash: "d9343cb", date: "2026-11-05", message: "Add agent map, impact check and version 2 roadmap to /demo", page: null },
      { hash: "0e4a0d3", date: "2026-11-05", message: "Add testing summary and demo tests API", page: null },
    ],
  },
];
