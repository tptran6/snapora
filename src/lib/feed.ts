import { auth } from "@/auth";
import { db } from "@/lib/prisma";
import type { Post } from "@/lib/data";

function formatTime(date: Date) {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
}

export async function getFeedPosts(): Promise<Post[]> {
  const session = await auth();

  const posts = await db.post.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: true,
      comments: {
        include: { user: true },
        orderBy: { createdAt: "asc" },
      },
      _count: { select: { likes: true } },
      likes: session?.user?.id
        ? { where: { userId: session.user.id }, select: { id: true } }
        : false,
    },
  });

  return posts.map((post) => ({
    id: post.id,
    caption: post.caption,
    image: post.imageUrl,
    location: post.location ?? undefined,
    likes: post._count.likes,
    liked: Array.isArray(post.likes) ? post.likes.length > 0 : false,
    createdAt: formatTime(post.createdAt),
    user: {
      id: post.user.id,
      username: post.user.username ?? post.user.name ?? "user",
      name: post.user.name ?? "User",
      avatar:
        post.user.image ??
        `https://i.pravatar.cc/120?u=${post.user.id}`,
      verified: false,
    },
    comments: post.comments.map((comment) => ({
      id: comment.id,
      user: comment.user.username ?? comment.user.name ?? "user",
      text: comment.body,
    })),
  }));
}

export async function getSuggestedUsers() {
  const session = await auth();
  const currentId = session?.user?.id;

  const users = await db.user.findMany({
    where: currentId ? { NOT: { id: currentId } } : undefined,
    take: 5,
    orderBy: { createdAt: "desc" },
  });

  const followingIds = currentId
    ? (
        await db.follow.findMany({
          where: { followerId: currentId },
          select: { followingId: true },
        })
      ).map((item) => item.followingId)
    : [];

  return users.map((user) => ({
    id: user.id,
    username: user.username ?? "user",
    name: user.name ?? "User",
    avatar: user.image ?? `https://i.pravatar.cc/120?u=${user.id}`,
    verified: false,
    following: followingIds.includes(user.id),
  }));
}
