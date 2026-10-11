import type { SocialPost, VideoScript } from "@/lib/marketing-content";

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
