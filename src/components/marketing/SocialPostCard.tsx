import type { SocialPost } from "@/lib/marketing-content";
import { formatSocialPost } from "@/lib/marketing-format";
import CopyButton from "./CopyButton";

export default function SocialPostCard({ post }: { post: SocialPost }) {
  return (
    <div id={post.id} className="rounded-xl border border-zinc-200 p-6">
      <div className="flex items-start justify-between gap-3">
        <span className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-700">
          {post.platform}
        </span>
        <CopyButton text={formatSocialPost(post)} />
      </div>
      <p className="mt-3 text-sm font-semibold text-zinc-900">{post.hook}</p>
      <p className="mt-2 text-sm leading-6 text-zinc-600">{post.caption}</p>
      {post.hashtags.length > 0 && (
        <p className="mt-2 text-xs text-indigo-600">
          {post.hashtags.join(" ")}
        </p>
      )}
      <p className="mt-3 text-xs font-medium text-zinc-500">{post.cta}</p>
    </div>
  );
}
