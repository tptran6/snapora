import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/prisma";
import FollowButton from "@/components/FollowButton";

type Params = { username: string };

export default async function ProfilePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { username } = await params;
  const session = await auth();

  const user = await db.user.findUnique({
    where: { username },
    include: {
      _count: {
        select: { posts: true, followers: true, following: true },
      },
    },
  });

  if (!user) notFound();

  const posts = await db.post.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  const isFollowing = session?.user?.id
    ? Boolean(
        await db.follow.findUnique({
          where: {
            followerId_followingId: {
              followerId: session.user.id,
              followingId: user.id,
            },
          },
        }),
      )
    : false;

  const isOwnProfile = session?.user?.id === user.id;

  return (
    <div className="mx-auto max-w-[935px] px-4 py-6 md:py-10">
      <header className="mb-8 flex flex-col gap-6 md:flex-row md:items-center">
        <Image
          src={user.image ?? `https://i.pravatar.cc/150?u=${user.id}`}
          alt={user.username ?? "user"}
          width={150}
          height={150}
          className="h-24 w-24 rounded-full object-cover md:h-36 md:w-36"
        />
        <div className="flex-1">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <h1 className="text-xl font-light">{user.username}</h1>
            {isOwnProfile ? (
              <span className="rounded-lg bg-neutral-100 px-4 py-1.5 text-sm font-semibold dark:bg-neutral-900">
                Edit profile
              </span>
            ) : (
              <FollowButton userId={user.id} initialFollowing={isFollowing} />
            )}
          </div>
          <div className="mb-4 flex gap-6 text-sm">
            <span><strong>{user._count.posts}</strong> posts</span>
            <span><strong>{user._count.followers}</strong> followers</span>
            <span><strong>{user._count.following}</strong> following</span>
          </div>
          <div>
            <div className="font-semibold">{user.name}</div>
            <p className="text-sm text-neutral-500">{user.bio}</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-3 gap-1 md:gap-4">
        {posts.map((post) => (
          <div key={post.id} className="relative aspect-square overflow-hidden bg-neutral-100 dark:bg-neutral-900">
            <Image
              src={post.imageUrl}
              alt={post.caption}
              fill
              sizes="300px"
              className="object-cover"
            />
          </div>
        ))}
      </div>

      <div className="mt-6">
        <Link href="/" className="text-sm text-blue-500">
          Back to feed
        </Link>
      </div>
    </div>
  );
}
