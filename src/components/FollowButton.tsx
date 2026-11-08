"use client";

import { useTransition, useState } from "react";
import { toggleFollow } from "@/app/actions";

export default function FollowButton({
  userId,
  initialFollowing,
}: {
  userId: string;
  initialFollowing: boolean;
}) {
  const [isFollowing, setFollowing] = useState(initialFollowing);
  const [pending, startTransition] = useTransition();

  return (
    <button
      onClick={() => {
        setFollowing((value) => !value);
        startTransition(async () => {
          await toggleFollow(userId);
        });
      }}
      disabled={pending}
      className={`rounded-lg px-4 py-1.5 text-sm font-semibold ${
        isFollowing
          ? "bg-neutral-100 dark:bg-neutral-900"
          : "bg-blue-500 text-white"
      }`}
    >
      {isFollowing ? "Following" : "Follow"}
    </button>
  );
}
