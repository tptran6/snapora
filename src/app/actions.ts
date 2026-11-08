"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { db } from "@/lib/prisma";

export async function toggleLike(postId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const existing = await db.like.findUnique({
    where: { userId_postId: { userId: session.user.id, postId } },
  });

  if (existing) {
    await db.like.delete({ where: { id: existing.id } });
  } else {
    await db.like.create({
      data: { userId: session.user.id, postId },
    });
  }

  revalidatePath("/");
  revalidatePath("/profile");
}

export async function addComment(postId: string, body: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  if (!body.trim()) return;

  await db.comment.create({
    data: { body: body.trim(), postId, userId: session.user.id },
  });

  revalidatePath("/");
  revalidatePath("/profile");
}

export async function createPost(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const caption = String(formData.get("caption") ?? "").trim();
  const imageUrl = String(formData.get("imageUrl") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();

  if (!caption || !imageUrl) throw new Error("Caption and image URL are required");

  await db.post.create({
    data: {
      caption,
      imageUrl,
      location: location || null,
      userId: session.user.id,
    },
  });

  revalidatePath("/");
  revalidatePath(`/profile/${session.user.username ?? ""}`);
}

export async function toggleFollow(userId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  if (session.user.id === userId) return;

  const existing = await db.follow.findUnique({
    where: { followerId_followingId: { followerId: session.user.id, followingId: userId } },
  });

  if (existing) {
    await db.follow.delete({ where: { followerId_followingId: { followerId: session.user.id, followingId: userId } } });
  } else {
    await db.follow.create({ data: { followerId: session.user.id, followingId: userId } });
  }

  revalidatePath("/");
  revalidatePath("/profile");
}
