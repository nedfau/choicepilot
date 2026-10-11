import type {
  AbTest,
  Brand,
  CalendarDay,
  LandingCopy,
  Persona,
  SocialPost,
  VideoScript,
} from "@/lib/marketing-content";
import { TEMPLATE_CONTENT_LABEL } from "@/lib/marketing-content";

function csvField(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function calendarToCsv(calendar: CalendarDay[]): string {
  const header = ["Day", "Channel", "Asset ref", "Goal", "CTA"];
  const rows = calendar.map((day) => [
    String(day.day),
    day.channel,
    day.assetRef,
    day.goal,
    day.cta,
  ]);
  return [header, ...rows]
    .map((row) => row.map(csvField).join(","))
    .join("\n");
}

export function calendarToText(calendar: CalendarDay[]): string {
  return calendar
    .map(
      (day) =>
        `Day ${day.day} — ${day.channel} — ${day.assetRef} — ${day.goal} — CTA: ${day.cta}`
    )
    .join("\n");
}

export function formatSocialPost(post: SocialPost): string {
  const lines = [
    `${post.platform} — ${post.id}`,
    "",
    post.hook,
    "",
    post.caption,
  ];
  if (post.hashtags.length > 0) {
    lines.push("", post.hashtags.join(" "));
  }
  lines.push("", `CTA: ${post.cta}`);
  return lines.join("\n");
}

export function formatBrand(brand: Brand): string {
  const lines = [`# Brand: ${brand.name}`, "", brand.tagline, "", "## Voice"];
  brand.voiceAttributes.forEach((attr) => {
    lines.push(
      `- ${attr.name} — Do: "${attr.doExample}" / Don't: "${attr.dontExample}"`
    );
  });
  lines.push("", "## Colors");
  brand.colors.forEach((color) => {
    lines.push(`- ${color.name} (${color.hex}) — ${color.usage}`);
  });
  lines.push("", `## Font\n${brand.font}`, "", `## Logo\n${brand.logoNote}`);
  return lines.join("\n");
}

export function formatPersona(persona: Persona): string {
  const lines = [
    `# Persona: ${persona.name}, ${persona.age} (fictional)`,
    "",
    persona.fictionalNote,
    "",
    `${persona.program}, moving from ${persona.origin} to ${persona.destination}.`,
    "",
    "## Goals",
    ...persona.goals.map((g) => `- ${g}`),
    "",
    "## Frustrations",
    ...persona.frustrations.map((f) => `- ${f}`),
    "",
    "## Channels",
    ...persona.channels.map((c) => `- ${c}`),
  ];
  return lines.join("\n");
}

export function formatLandingCopy(copy: LandingCopy): string {
  const lines = [
    "# Landing copy",
    "",
    `## Hero\n${copy.heroHeadline}\n${copy.subheadline}`,
    "",
    `Primary CTA: ${copy.primaryCta.label} (${copy.primaryCta.href})`,
    `Secondary CTA: ${copy.secondaryCta.label} (${copy.secondaryCta.href})`,
    "",
    "## Benefits",
    ...copy.benefits.map((b) => `- ${b.title} — ${b.description}`),
    "",
    "## How it works",
    ...copy.howItWorksSteps.map(
      (s) => `${s.number}. ${s.title} — ${s.description}`
    ),
    "",
    "## FAQ",
    ...copy.faq.map((item) => `- Q: ${item.question}\n  A: ${item.answer}`),
    "",
    `## Final CTA\n${copy.finalCta.heading}\n${copy.finalCta.body}\nCTA: ${copy.finalCta.cta.label}`,
  ];
  return lines.join("\n");
}

export function formatVideoScript(script: VideoScript): string {
  const lines = [
    `${script.title} (${script.duration})`,
    "",
    `Hook: ${script.hook}`,
    "",
  ];
  script.scenes.forEach((scene, i) => {
    lines.push(`Scene ${i + 1}`);
    lines.push(`Visual: ${scene.visual}`);
    lines.push(`Voiceover: ${scene.voiceover}`);
    lines.push("");
  });
  lines.push(`CTA: ${script.cta}`);
  return lines.join("\n");
}

export function formatAllAssetsMarkdown(assets: {
  brand: Brand;
  persona: Persona;
  landingCopy: LandingCopy;
  socialPosts: SocialPost[];
  videoScripts: VideoScript[];
  calendar: CalendarDay[];
  abTests: AbTest[];
}): string {
  const sections = [
    `# ChoicePilot marketing assets\n\n${TEMPLATE_CONTENT_LABEL}`,
    formatBrand(assets.brand),
    formatPersona(assets.persona),
    formatLandingCopy(assets.landingCopy),
    "# Social posts\n\n" +
      assets.socialPosts.map((p) => formatSocialPost(p)).join("\n\n---\n\n"),
    "# Video scripts\n\n" +
      assets.videoScripts
        .map((s) => formatVideoScript(s))
        .join("\n\n---\n\n"),
    "# 14-day campaign calendar\n\n" + calendarToText(assets.calendar),
    "# A/B tests\n\n" +
      assets.abTests
        .map(
          (test) =>
            `## ${test.label} (${test.testName})\n- A: ${test.variants[0].copy}\n- B: ${test.variants[1].copy}`
        )
        .join("\n\n"),
  ];
  return sections.join("\n\n---\n\n");
}
