"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from "lucide-react";
import type { Post, Comment } from "@/lib/data";
import { toggleLike, addComment } from "@/app/actions";

export default function PostCard({ post }: { post: Post }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [liked, setLiked] = useState(Boolean(post.liked));
  const [saved, setSaved] = useState(false);
  const [likes, setLikes] = useState(post.likes);
  const [comments, setComments] = useState<Comment[]>(post.comments);
  const [draft, setDraft] = useState("");
  const [showAll, setShowAll] = useState(false);

  const visibleComments = showAll ? comments : comments.slice(-2);

  function handleLike() {
    const nextLiked = !liked;
    setLiked(nextLiked);
    setLikes((value) => (nextLiked ? value + 1 : Math.max(0, value - 1)));
    startTransition(async () => {
      await toggleLike(post.id);
      router.refresh();
    });
  }

  function submitComment(event: React.FormEvent) {
    event.preventDefault();
    if (!draft.trim()) return;
    const text = draft.trim();
    setComments((value) => [
      ...value,
      { id: `local-${Date.now()}`, user: "you", text },
    ]);
    setDraft("");
    startTransition(async () => {
      await addComment(post.id, text);
      router.refresh();
    });
  }

  return (
    <article className="border-b border-neutral-200 bg-white dark:border-neutral-800 dark:bg-black">
      <header className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <Image
            src={post.user.avatar}
            alt={post.user.username}
            width={32}
            height={32}
            className="h-8 w-8 rounded-full object-cover"
          />
          <div className="leading-tight">
            <div className="flex items-center gap-1 text-sm font-semibold">
              {post.user.username}
              {post.user.verified && <span className="text-blue-500">✓</span>}
            </div>
            {post.location && (
              <div className="text-xs text-neutral-500">{post.location}</div>
            )}
          </div>
        </div>
        <button aria-label="More options">
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </header>

      <div className="relative aspect-[4/5] w-full bg-neutral-100 dark:bg-neutral-900">
        <Image
          src={post.image}
          alt={post.caption}
          fill
          sizes="(max-width: 768px) 100vw, 640px"
          className="object-cover"
          priority={post.id === "p1" || pending}
          loading="eager"
        />
      </div>

      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleLike}
              disabled={pending}
              aria-label={liked ? "Unlike" : "Like"}
            >
              <Heart
                className={`h-6 w-6 transition-transform active:scale-125 ${
                  liked ? "fill-red-500 text-red-500" : ""
                }`}
              />
            </button>
            <button aria-label="Comment">
              <MessageCircle className="h-6 w-6" />
            </button>
            <button aria-label="Share">
              <Send className="h-6 w-6" />
            </button>
          </div>
          <button onClick={() => setSaved((value) => !value)} aria-label={saved ? "Unsave" : "Save"}>
            <Bookmark className={`h-6 w-6 ${saved ? "fill-current" : ""}`} />
          </button>
        </div>

        <div className="mt-2 text-sm font-semibold">
          {likes.toLocaleString()} likes
        </div>
        <p className="mt-1 text-sm">
          <span className="font-semibold">{post.user.username}</span>{" "}
          {post.caption}
        </p>

        {comments.length > 2 && !showAll && (
          <button
            onClick={() => setShowAll(true)}
            className="mt-1 text-sm text-neutral-500"
          >
            View all {comments.length} comments
          </button>
        )}

        <ul className="mt-1 space-y-1">
          {visibleComments.map((comment) => (
            <li key={comment.id} className="text-sm">
              <span className="font-semibold">{comment.user}</span> {comment.text}
            </li>
          ))}
        </ul>

        <div className="mt-2 text-xs uppercase text-neutral-400">{post.createdAt}</div>
      </div>

      <form onSubmit={submitComment} className="flex items-center gap-3 border-t border-neutral-200 px-4 py-2 dark:border-neutral-800">
        <Image
          src="https://i.pravatar.cc/120?img=12"
          alt="you"
          width={24}
          height={24}
          className="h-6 w-6 rounded-full object-cover"
        />
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Add a comment..."
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-neutral-400"
        />
        <button
          type="submit"
          disabled={!draft.trim() || pending}
          className="text-sm font-semibold text-blue-500 disabled:opacity-40"
        >
          Post
        </button>
      </form>
    </article>
  );
}
