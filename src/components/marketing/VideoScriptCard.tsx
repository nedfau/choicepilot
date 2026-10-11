import type { VideoScript } from "@/lib/marketing-content";
import { formatVideoScript } from "@/lib/marketing-format";
import CopyButton from "./CopyButton";

export default function VideoScriptCard({ script }: { script: VideoScript }) {
  return (
    <div id={script.id} className="rounded-xl border border-zinc-200 p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-zinc-900">
            {script.title}
          </p>
          <p className="text-xs text-zinc-400">{script.duration}</p>
        </div>
        <CopyButton text={formatVideoScript(script)} />
      </div>
      <p className="mt-3 text-sm font-medium text-zinc-700">
        Hook: {script.hook}
      </p>
      <ol className="mt-3 space-y-2">
        {script.scenes.map((scene, i) => (
          <li key={i} className="text-xs leading-5 text-zinc-600">
            <span className="font-semibold text-zinc-900">
              Scene {i + 1}.
            </span>{" "}
            <span className="text-zinc-700">{scene.visual}</span>
            <br />
            <span className="italic text-zinc-500">
              &ldquo;{scene.voiceover}&rdquo;
            </span>
          </li>
        ))}
      </ol>
      <p className="mt-3 text-xs font-medium text-zinc-500">
        CTA: {script.cta}
      </p>
    </div>
  );
}
