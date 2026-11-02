// Week 5: rule-based chat logic. Pure TypeScript — no UI, no network,
// no AI/LLM calls. Every assistant response here is simulated.

export type DecisionType = "Housing" | "Insurance" | "Banking";
export type Priority =
  | "Lowest cost"
  | "Meets all requirements"
  | "Convenience"
  | "Flexibility";
export type Timeline =
  | "Before I arrive"
  | "First weeks after arriving"
  | "Already settled";

export interface IntakeQuestion {
  id: "decision_type" | "priority" | "timeline";
  question: string;
  options: string[];
}

export const INTAKE_QUESTIONS: IntakeQuestion[] = [
  {
    id: "decision_type",
    question: "What are you deciding on?",
    options: ["Housing", "Insurance", "Banking"],
  },
  {
    id: "priority",
    question: "What matters most to you?",
    options: [
      "Lowest cost",
      "Meets all requirements",
      "Convenience",
      "Flexibility",
    ],
  },
  {
    id: "timeline",
    question: "When do you need this decided?",
    options: [
      "Before I arrive",
      "First weeks after arriving",
      "Already settled",
    ],
  },
];

const OPTION_KEYWORDS: Record<string, Record<string, string[]>> = {
  decision_type: {
    Housing: [
      "housing",
      "house",
      "apartment",
      "flat",
      "rent",
      "rental",
      "room",
      "dorm",
      "accommodation",
    ],
    Insurance: ["insurance", "coverage", "policy", "health plan"],
    Banking: ["banking", "bank", "bank account", "account", "debit"],
  },
  priority: {
    "Lowest cost": ["cost", "price", "cheap", "cheapest", "affordable", "budget"],
    "Meets all requirements": [
      "requirement",
      "requirements",
      "compliant",
      "compliance",
      "accepted",
      "valid",
      "official",
    ],
    Convenience: ["convenience", "convenient", "easy", "simple", "quick", "fast"],
    Flexibility: ["flexible", "flexibility", "cancel", "change", "switch"],
  },
  timeline: {
    "Before I arrive": [
      "before i arrive",
      "before arriving",
      "before arrival",
      "not arrived",
      "still at home",
      "before i land",
      "before i come",
      "before moving",
    ],
    "First weeks after arriving": [
      "first week",
      "first weeks",
      "just arrived",
      "just landed",
      "recently arrived",
      "after arriving",
    ],
    "Already settled": [
      "already settled",
      "been here a while",
      "settled in",
      "already here",
      "long time",
      "for a while now",
    ],
  },
};

/** Match free text to one of a question's fixed options by keyword. */
export function matchOption(
  questionId: IntakeQuestion["id"],
  text: string
): string | null {
  const question = INTAKE_QUESTIONS.find((q) => q.id === questionId);
  if (!question) return null;

  const normalized = text.toLowerCase().trim();
  if (!normalized) return null;

  const keywordMap = OPTION_KEYWORDS[questionId] ?? {};
  for (const option of question.options) {
    const keywords = keywordMap[option] ?? [];
    if (keywords.some((keyword) => normalized.includes(keyword))) {
      return option;
    }
  }

  // Fall back to a direct match against the option's own text.
  for (const option of question.options) {
    if (normalized.includes(option.toLowerCase())) {
      return option;
    }
  }

  return null;
}

// ---------------------------------------------------------------------------
// Guardrails
// ---------------------------------------------------------------------------

export type GuardrailCategory =
  | "prompt_injection"
  | "personal_data"
  | "legal_visa"
  | "medical"
  | "financial_advice";

export interface GuardrailResult {
  category: GuardrailCategory;
  message: string;
}

const GUARDRAIL_KEYWORDS: Record<GuardrailCategory, string[]> = {
  prompt_injection: [
    "ignore previous instructions",
    "ignore all previous instructions",
    "disregard your instructions",
    "disregard previous instructions",
    "system prompt",
    "pretend you are",
    "act as if you are",
    "forget your instructions",
    "you are now",
  ],
  personal_data: ["passport", "password"],
  legal_visa: [
    "visa",
    "residence permit",
    "residency permit",
    "immigration",
    "lawyer",
    "attorney",
    "deportation",
    "asylum",
  ],
  medical: [
    "symptom",
    "symptoms",
    "diagnose",
    "diagnosis",
    "medication",
    "medications",
    "prescription",
    "medical condition",
    "illness",
    "disease",
    "surgery",
    "headache",
    "pain",
    "sick",
    "fever",
    "dizzy",
    "injury",
    "medicine",
    "pill",
    "pills",
    "antibiotic",
    "antibiotics",
    "treatment",
  ],
  financial_advice: [
    "invest",
    "investment",
    "stocks",
    "stock market",
    "crypto",
    "cryptocurrency",
    "loan advice",
    "which loan",
    "mortgage advice",
    "financial advisor",
  ],
};

const GUARDRAIL_MESSAGES: Record<GuardrailCategory, string> = {
  legal_visa:
    "I can't give visa, immigration, or other legal advice — rules vary by country and getting it wrong can have serious consequences. Please check with your university's international office or an immigration lawyer. I can help you think through housing, insurance, or banking instead.",
  medical:
    "I can't give medical advice — that needs a licensed doctor who knows your health history. Please contact a doctor, your university's health service, or local emergency services if it's urgent. I can help you think through housing, insurance, or banking instead.",
  financial_advice:
    "I can't give investment or loan advice — that needs a licensed financial advisor who can look at your full situation. Please talk to a bank advisor or a licensed financial professional. I can help you think through housing, insurance, or banking instead.",
  personal_data:
    "I noticed what might be personal information, like an email, phone number, bank number, or passport details. I don't store or repeat that kind of information, so please don't share it here. Let's stick to general preferences instead.",
  prompt_injection:
    "I can't change how I work based on instructions typed into the chat. I can only help you think through housing, insurance, and banking decisions using the three fixed questions.",
};

const EMAIL_PATTERN = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/;
const PHONE_PATTERN = /\b\d[\d\s-]{7,}\d\b/;
const IBAN_PATTERN = /\b[A-Za-z]{2}\d{2}[A-Za-z0-9]{10,30}\b/;

const MEDICAL_DISTRESS_KEYWORDS = [
  "depressed",
  "depression",
  "hopeless",
  "suicidal",
  "suicide",
  "kill myself",
  "hurt myself",
  "harm myself",
  "self-harm",
  "self harm",
  "want to die",
  "end my life",
  "don't want to live",
  "no reason to live",
];

const MEDICAL_DISTRESS_MESSAGE =
  "I'm not able to help with that, but you deserve support. Please reach out to local emergency services, a crisis line, or your university's counseling service — right now, if you're able to.";

/** Case-insensitive whole-word (or whole-phrase) match, so a keyword inside
 * a longer word (e.g. "sick" inside "seasickness") doesn't trigger. */
function matchesWholeWord(text: string, words: string[]): boolean {
  return words.some((word) => new RegExp(`\\b${word}\\b`, "i").test(text));
}

/** Check free text for anything the assistant must not act on or store. */
export function checkGuardrail(text: string): GuardrailResult | null {
  const normalized = text.toLowerCase();

  if (GUARDRAIL_KEYWORDS.prompt_injection.some((k) => normalized.includes(k))) {
    return { category: "prompt_injection", message: GUARDRAIL_MESSAGES.prompt_injection };
  }

  if (
    EMAIL_PATTERN.test(text) ||
    PHONE_PATTERN.test(text) ||
    IBAN_PATTERN.test(text) ||
    GUARDRAIL_KEYWORDS.personal_data.some((k) => normalized.includes(k))
  ) {
    return { category: "personal_data", message: GUARDRAIL_MESSAGES.personal_data };
  }

  if (GUARDRAIL_KEYWORDS.legal_visa.some((k) => normalized.includes(k))) {
    return { category: "legal_visa", message: GUARDRAIL_MESSAGES.legal_visa };
  }

  if (matchesWholeWord(text, MEDICAL_DISTRESS_KEYWORDS)) {
    return { category: "medical", message: MEDICAL_DISTRESS_MESSAGE };
  }

  if (matchesWholeWord(text, GUARDRAIL_KEYWORDS.medical)) {
    return { category: "medical", message: GUARDRAIL_MESSAGES.medical };
  }

  if (GUARDRAIL_KEYWORDS.financial_advice.some((k) => normalized.includes(k))) {
    return { category: "financial_advice", message: GUARDRAIL_MESSAGES.financial_advice };
  }

  return null;
}

// ---------------------------------------------------------------------------
// Response builder
// ---------------------------------------------------------------------------

export interface IntakeAnswers {
  decision_type: DecisionType;
  priority: Priority;
  timeline: Timeline;
}

export interface ResponseLink {
  href: string;
  label: string;
}

export interface ChatResponse {
  summary: string[];
  steps: string[];
  links: ResponseLink[];
  needsHumanCheckpoint: boolean;
  checkpointText: string;
}

const DECISION_INTRO_LINE: Record<DecisionType, string> = {
  Housing:
    "You're deciding on housing — this is usually one of the first and most time-sensitive decisions international students make.",
  Insurance:
    "You're deciding on insurance — coverage rules are often tied to your visa or enrollment status, so details matter.",
  Banking:
    "You're deciding on a bank account — requirements and what's accepted vary by bank and by your residency status.",
};

const PRIORITY_SUMMARY_LINE: Record<Priority, string> = {
  "Lowest cost":
    "You said lowest cost matters most, so compare total price, not just the headline number — watch for extra fees that add up.",
  "Meets all requirements":
    "You said meeting all requirements matters most, so confirm the official rules first — cost and convenience come second.",
  Convenience:
    "You said convenience matters most, so weigh how much time and effort each option takes to set up, not just the price.",
  Flexibility:
    "You said flexibility matters most, so check what happens if your plans change — cancellation terms and lock-in periods.",
};

const CLOSING_LINE =
  "This is general guidance to help you structure the decision yourself — not a recommendation of any specific provider, and not legal or financial advice.";

const DECISION_STEPS: Record<DecisionType, string[]> = {
  Housing: [
    "List 2-3 housing options you're considering (type, location, lease length).",
    "Check what each one requires from you (deposit, documents, guarantor).",
    "Compare them side by side using /core to structure your options.",
    "Confirm the fine print — cancellation, deposit return, renewal — before signing.",
  ],
  Insurance: [
    "Check what coverage your visa or university requires, not just what's offered.",
    "List the insurance options you're comparing and what each one actually covers.",
    "Use /core to structure the comparison by what matters most to you.",
    "Confirm with your university or the insurer that a plan meets the requirement before you buy it.",
  ],
  Banking: [
    "Check what documents you'll need to open an account as an international student.",
    "List the account options you're comparing (fees, transfers, app access).",
    "Use /core to structure the comparison by your own priorities.",
    "Confirm account requirements directly with the bank before visiting a branch.",
  ],
};

const CHECKPOINT_TEXT: Record<DecisionType, string> = {
  Housing:
    "Lease and deposit rules vary by city and landlord — confirm the details with your university's housing office or a local tenant advice service before signing anything.",
  Insurance:
    "Insurance requirements vary by visa type and university — confirm your plan meets them with your international office or the insurer directly before you commit.",
  Banking:
    "Required documents and account rules vary by bank and visa status — confirm what's accepted with the bank directly before you commit.",
};

/** Build a simulated response from completed intake answers. */
export function buildResponse(answers: IntakeAnswers): ChatResponse {
  const { decision_type, priority } = answers;

  const summary = [
    DECISION_INTRO_LINE[decision_type],
    PRIORITY_SUMMARY_LINE[priority],
    CLOSING_LINE,
  ];

  let steps = [...DECISION_STEPS[decision_type]];
  if (decision_type === "Housing" && priority === "Meets all requirements") {
    steps = [steps[1], steps[0], steps[2], steps[3]];
  }

  const needsHumanCheckpoint =
    decision_type === "Insurance" || priority === "Meets all requirements";

  return {
    summary,
    steps,
    links: [
      { href: "/core", label: "structure your options" },
      { href: "/research", label: "see how options compare" },
    ],
    needsHumanCheckpoint,
    checkpointText: needsHumanCheckpoint ? CHECKPOINT_TEXT[decision_type] : "",
  };
}
