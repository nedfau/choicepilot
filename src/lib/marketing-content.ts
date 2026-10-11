// Week 4: Marketing Engine + Content System
//
// Template content drafted with AI assistance, not published anywhere.
// No real users, testimonials, statistics, logos, or partnerships are
// implied anywhere in this file — ChoicePilot has no real users yet.

export const TEMPLATE_CONTENT_LABEL =
  "Template content drafted with AI assistance, not published anywhere.";

// ---------------------------------------------------------------------------
// Brand system
// ---------------------------------------------------------------------------

export interface VoiceAttribute {
  name: string;
  doExample: string;
  dontExample: string;
}

export interface ColorSwatch {
  name: string;
  hex: string;
  usage: string;
}

export interface Brand {
  name: string;
  tagline: string;
  voiceAttributes: VoiceAttribute[];
  colors: ColorSwatch[];
  font: string;
  logoNote: string;
}

export const brand: Brand = {
  name: "ChoicePilot",
  tagline: "The confusing stuff, decided with confidence.",
  voiceAttributes: [
    {
      name: "Calm",
      doExample:
        "Compare your options, weighted by what matters to you.",
      dontExample: "🚨 STOP SCROLLING — you NEED to see this right now!!!",
    },
    {
      name: "Honest",
      doExample:
        "We don't have real users yet — this is a work in progress.",
      dontExample:
        "Join thousands of happy students already using ChoicePilot.",
    },
    {
      name: "Specific",
      doExample:
        "Compare housing, insurance, and banking side by side, weighted by your priorities.",
      dontExample: "Making your life easier, one decision at a time.",
    },
  ],
  colors: [
    { name: "Indigo 600", hex: "#4f46e5", usage: "Primary CTA buttons, active toggle state" },
    { name: "Indigo 50", hex: "#eef2ff", usage: "Soft accent backgrounds (step numbers, badges)" },
    { name: "Emerald 600", hex: "#059669", usage: "Shipped/positive status" },
    { name: "Amber 700", hex: "#b45309", usage: "Simulated/placeholder/caution labels" },
    { name: "Red 600", hex: "#dc2626", usage: "Error and validation states" },
    { name: "Zinc 900", hex: "#18181b", usage: "Primary text, headings" },
    { name: "Zinc 600", hex: "#52525b", usage: "Secondary body text" },
    { name: "Zinc 200", hex: "#e4e4e7", usage: "Borders, dividers" },
    { name: "White", hex: "#ffffff", usage: "Page background" },
  ],
  font: "Geist Sans (next/font/google) for all UI text; Geist Mono available for code or data display.",
  logoNote:
    "Wordmark only for now: \"ChoicePilot\" set in Geist Sans Semibold, tracking-tight, Zinc 900. No icon or logomark has been designed yet.",
};

// ---------------------------------------------------------------------------
// Persona
// ---------------------------------------------------------------------------

export interface Persona {
  name: string;
  isFictional: true;
  fictionalNote: string;
  age: number;
  origin: string;
  destination: string;
  program: string;
  goals: string[];
  frustrations: string[];
  channels: string[];
}

export const persona: Persona = {
  name: "Ana",
  isFictional: true,
  fictionalNote:
    "Fictional persona for design purposes only — not a real ChoicePilot user.",
  age: 24,
  origin: "Mexico",
  destination: "Germany",
  program: "Master's student",
  goals: [
    "Find student housing she can apply for before arriving",
    "Get health insurance that satisfies her visa and enrollment requirements",
    "Open a local bank account in her first few weeks",
  ],
  frustrations: [
    "Comparison sites that only surface sponsored or affiliate-linked options",
    "Advice scattered across forums and social posts that contradicts itself",
    "No single source that weighs options by what she actually cares about",
  ],
  channels: ["Instagram", "TikTok", "WhatsApp and Discord university groups"],
};

// ---------------------------------------------------------------------------
// Landing copy
// ---------------------------------------------------------------------------

export interface Benefit {
  title: string;
  description: string;
}

export interface HowItWorksStep {
  number: string;
  title: string;
  description: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface CtaLink {
  label: string;
  href: string;
}

export interface FinalCta {
  heading: string;
  body: string;
  cta: CtaLink;
}

export interface LandingCopy {
  heroHeadline: string;
  subheadline: string;
  primaryCta: CtaLink;
  secondaryCta: CtaLink;
  benefits: Benefit[];
  howItWorksSteps: HowItWorksStep[];
  faq: FaqItem[];
  finalCta: FinalCta;
}

export const landingCopy: LandingCopy = {
  heroHeadline:
    "Make your first month abroad easier: compare housing, insurance and banking your way.",
  subheadline:
    "ChoicePilot is a non-affiliate way to weigh your options by what matters to you — no sponsored rankings, no hidden commissions.",
  primaryCta: { label: "Try ChoicePilot", href: "/core" },
  secondaryCta: { label: "See how it works", href: "#how-it-works" },
  benefits: [
    {
      title: "No sponsored rankings",
      description:
        "Every comparison is weighted by your own priorities, not by who pays the most.",
    },
    {
      title: "One place, three decisions",
      description:
        "Housing, insurance, and banking in one tool instead of three different sites.",
    },
    {
      title: "Built for international students",
      description:
        "Designed around the specific, first-weeks-abroad decisions that general comparison sites don't cover.",
    },
  ],
  howItWorksSteps: [
    {
      number: "1",
      title: "Add the options you're weighing",
      description:
        "List the apartments, insurance plans, or bank accounts you're deciding between.",
    },
    {
      number: "2",
      title: "Set your priorities",
      description:
        "Tell ChoicePilot what matters most to you — price, coverage, location, flexibility, and more.",
    },
    {
      number: "3",
      title: "See a transparent, scored recommendation",
      description:
        "Get a clear, personalized ranking with no sponsored placements or affiliate bias.",
    },
  ],
  faq: [
    {
      question:
        "Is ChoicePilot affiliated with any housing, insurance, or banking provider?",
      answer:
        "No. ChoicePilot doesn't accept referral fees or sponsored placements. See how options are compared on /research.",
    },
    {
      question: "Does ChoicePilot have real users yet?",
      answer:
        "Not yet — ChoicePilot is in active development. The content on this site, including this marketing page, is drafted as a template and hasn't been published anywhere else.",
    },
    {
      question: "How much does ChoicePilot cost?",
      answer:
        "Pricing is still a hypothesis we're testing, not final. See the live numbers on /pricing.",
    },
  ],
  finalCta: {
    heading: "Ready to take a look?",
    body: "ChoicePilot is early and built in the open. Try the one tool that's live today.",
    cta: { label: "Try ChoicePilot", href: "/core" },
  },
};

// ---------------------------------------------------------------------------
// Social posts (exactly 10)
// ---------------------------------------------------------------------------

export type SocialPlatform = "Instagram" | "TikTok" | "WhatsApp/Discord";

export interface SocialPost {
  id: string;
  platform: SocialPlatform;
  hook: string;
  caption: string;
  hashtags: string[];
  cta: string;
}

export const socialPosts: SocialPost[] = [
  {
    id: "post-1",
    platform: "Instagram",
    hook: "Nobody tells you how confusing your first month abroad really is.",
    caption:
      "Housing, insurance, a bank account — all before your classes even start. ChoicePilot weighs your options by what matters to you, not by who's paying for the placement.",
    hashtags: ["#StudyAbroad", "#InternationalStudent", "#MovingAbroad"],
    cta: "See how it works — link in bio",
  },
  {
    id: "post-2",
    platform: "TikTok",
    hook: "POV: you're trying to pick student housing in a country you've never lived in.",
    caption:
      "We built a non-affiliate way to compare your options side by side. No sponsored rankings.",
    hashtags: ["#StudyAbroadTok", "#StudentHousing"],
    cta: "Try ChoicePilot — link in bio",
  },
  {
    id: "post-3",
    platform: "Instagram",
    hook: "Comparison sites get paid when you click. We don't.",
    caption:
      "ChoicePilot is non-affiliate by design — see exactly how we compare options on /research.",
    hashtags: ["#TransparentTech", "#NonAffiliate"],
    cta: "Check the research",
  },
  {
    id: "post-4",
    platform: "WhatsApp/Discord",
    hook: "Anyone else drowning in conflicting advice about bank accounts abroad?",
    caption:
      "We're building ChoicePilot to cut through the noise — weigh your own priorities instead of guessing from forum threads. Would love your feedback.",
    hashtags: [],
    cta: "Reply with your biggest first-month headache",
  },
  {
    id: "post-5",
    platform: "TikTok",
    hook: "3 decisions every international student has to make in week one.",
    caption:
      "Housing. Insurance. Banking. Here's how we're trying to make all three less confusing.",
    hashtags: ["#InternationalStudents", "#StudyAbroadTips"],
    cta: "Full breakdown on our site",
  },
  {
    id: "post-6",
    platform: "Instagram",
    hook: "What if comparing insurance plans didn't feel like reading a legal contract?",
    caption:
      "ChoicePilot breaks down options by what you actually care about — price, coverage, flexibility.",
    hashtags: ["#StudentInsurance", "#StudyAbroad"],
    cta: "See the comparison approach",
  },
  {
    id: "post-7",
    platform: "TikTok",
    hook: "Why we're building a comparison tool with no sponsored results.",
    caption:
      "Most comparison sites earn commission from the options they rank first. We don't take referral fees — here's why that matters.",
    hashtags: ["#NonAffiliate", "#Transparency"],
    cta: "Learn more — link in bio",
  },
  {
    id: "post-8",
    platform: "Instagram",
    hook: "Moving abroad for your master's? Save this for week one.",
    caption:
      "A non-affiliate way to think through housing, insurance, and banking before you land.",
    hashtags: ["#MastersAbroad", "#InternationalStudent"],
    cta: "Bookmark for later",
  },
  {
    id: "post-9",
    platform: "WhatsApp/Discord",
    hook: "Quick question for anyone who's already moved abroad for school —",
    caption:
      "What would've made your first month easier? We're building ChoicePilot around real first-weeks decisions and want to get it right.",
    hashtags: [],
    cta: "Drop your answer below",
  },
  {
    id: "post-10",
    platform: "TikTok",
    hook: "We're not another affiliate comparison site. Here's the difference.",
    caption:
      "ChoicePilot weighs options by your priorities, not by who pays the most for placement. Still early — building this in public.",
    hashtags: ["#BuildInPublic", "#StudyAbroad"],
    cta: "Follow the build",
  },
];

// ---------------------------------------------------------------------------
// Video scripts (exactly 3)
// ---------------------------------------------------------------------------

export interface VideoScene {
  visual: string;
  voiceover: string;
}

export interface VideoScript {
  id: string;
  title: string;
  duration: string;
  hook: string;
  scenes: VideoScene[];
  cta: string;
}

export const videoScripts: VideoScript[] = [
  {
    id: "video-1",
    title: "Your First Month Abroad, Simplified",
    duration: "30s",
    hook: "Three decisions. One confusing month.",
    scenes: [
      {
        visual: "Student looking overwhelmed at a laptop with a dozen browser tabs open",
        voiceover: "Housing. Insurance. A bank account. All before classes start.",
      },
      {
        visual: "Close-up on a comparison site with \"Sponsored\" tags highlighted",
        voiceover: "Most comparison sites get paid to rank certain options first.",
      },
      {
        visual: "ChoicePilot interface showing priority inputs",
        voiceover:
          "ChoicePilot asks what actually matters to you — then compares your options that way.",
      },
      {
        visual: "Side-by-side comparison card on screen",
        voiceover: "No sponsored placements. No hidden commissions.",
      },
      {
        visual: "ChoicePilot wordmark on screen",
        voiceover: "ChoicePilot — still early, built in the open.",
      },
    ],
    cta: "See how it works on our site",
  },
  {
    id: "video-2",
    title: "Why We Don't Take Referral Fees",
    duration: "25s",
    hook: "Here's something most comparison sites won't tell you.",
    scenes: [
      {
        visual: "Text on screen: \"How comparison sites usually make money\"",
        voiceover: "Most comparison sites earn a commission every time you pick an option.",
      },
      {
        visual: "Simple diagram: provider, arrow, money, arrow, comparison site",
        voiceover: "That commission can quietly shape which options get ranked first.",
      },
      {
        visual: "ChoicePilot screen with no sponsored tags visible",
        voiceover: "ChoicePilot doesn't take referral fees. We're non-affiliate by design.",
      },
      {
        visual: "Research page showing gap notes next to each competitor",
        voiceover: "You can see exactly how we think about the market — gaps and all.",
      },
    ],
    cta: "Check the research page yourself",
  },
  {
    id: "video-3",
    title: "Meet Ana: A Week One Story (Fictional)",
    duration: "40s",
    hook: "Ana just landed for her master's. Week one looks like this.",
    scenes: [
      {
        visual: "Ana (fictional) arriving at an airport with luggage",
        voiceover: "Ana just moved from Mexico to Germany for her master's degree.",
      },
      {
        visual: "Ana scrolling through forum posts late at night",
        voiceover:
          "Like a lot of students, she's getting advice from five different forums — and none of it agrees.",
      },
      {
        visual: "Ana opening ChoicePilot on her phone",
        voiceover:
          "She tries weighing her options by what actually matters to her: price, location, flexibility.",
      },
      {
        visual: "Side-by-side housing comparison on screen",
        voiceover: "No sponsored picks — just her own priorities, laid out clearly.",
      },
      {
        visual: "Ana looking more settled, unpacking in a room",
        voiceover: "It's one less confusing decision in a very confusing month.",
      },
      {
        visual: "ChoicePilot wordmark",
        voiceover: "ChoicePilot. Built for the first-weeks mess — still early, built in the open.",
      },
    ],
    cta: "Follow along as we build it",
  },
];

// ---------------------------------------------------------------------------
// 14-day campaign calendar
// ---------------------------------------------------------------------------

export type CalendarGoal = "awareness" | "consideration" | "conversion";

export interface CalendarDay {
  day: number;
  channel: SocialPlatform;
  assetRef: string;
  goal: CalendarGoal;
  cta: string;
}

export const calendar: CalendarDay[] = [
  { day: 1, channel: "Instagram", assetRef: "post-1", goal: "awareness", cta: "See how it works — link in bio" },
  { day: 2, channel: "TikTok", assetRef: "post-2", goal: "awareness", cta: "Try ChoicePilot — link in bio" },
  { day: 3, channel: "WhatsApp/Discord", assetRef: "post-4", goal: "consideration", cta: "Reply with your biggest first-month headache" },
  { day: 4, channel: "Instagram", assetRef: "post-3", goal: "consideration", cta: "Check the research" },
  { day: 5, channel: "TikTok", assetRef: "video-1", goal: "awareness", cta: "See how it works on our site" },
  { day: 6, channel: "TikTok", assetRef: "post-5", goal: "awareness", cta: "Full breakdown on our site" },
  { day: 7, channel: "Instagram", assetRef: "post-6", goal: "consideration", cta: "See the comparison approach" },
  { day: 8, channel: "TikTok", assetRef: "video-2", goal: "consideration", cta: "Check the research page yourself" },
  { day: 9, channel: "TikTok", assetRef: "post-7", goal: "consideration", cta: "Learn more — link in bio" },
  { day: 10, channel: "Instagram", assetRef: "post-8", goal: "awareness", cta: "Bookmark for later" },
  { day: 11, channel: "WhatsApp/Discord", assetRef: "post-9", goal: "consideration", cta: "Drop your answer below" },
  { day: 12, channel: "TikTok", assetRef: "video-3", goal: "conversion", cta: "Follow along as we build it" },
  { day: 13, channel: "TikTok", assetRef: "post-10", goal: "conversion", cta: "Follow the build" },
  { day: 14, channel: "Instagram", assetRef: "post-1", goal: "conversion", cta: "Try ChoicePilot — link in bio" },
];

// ---------------------------------------------------------------------------
// A/B tests
// ---------------------------------------------------------------------------

export interface AbVariant {
  id: "A" | "B";
  copy: string;
}

export interface AbTest {
  testName: string;
  label: string;
  variants: [AbVariant, AbVariant];
}

export const abTests: AbTest[] = [
  {
    testName: "headline",
    label: "Hero headline",
    variants: [
      {
        id: "A",
        copy: "Make your first month abroad easier: compare housing, insurance and banking your way.",
      },
      {
        id: "B",
        copy: "No affiliate links. No hidden ranking. Just your priorities, weighed transparently.",
      },
    ],
  },
  {
    testName: "cta",
    label: "Primary CTA",
    variants: [
      { id: "A", copy: "Try ChoicePilot" },
      { id: "B", copy: "Compare my options" },
    ],
  },
];
