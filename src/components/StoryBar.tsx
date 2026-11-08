import Image from "next/image";
import { db } from "@/lib/prisma";

export default async function StoryBar() {
  const users = await db.user.findMany({ take: 8, orderBy: { createdAt: "desc" } });

  return (
    <section className="border-b border-neutral-200 bg-white px-4 py-4 dark:border-neutral-800 dark:bg-black">
      <div className="flex gap-4 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {users.map((user, index) => (
          <button
            key={user.id}
            className="flex w-[76px] shrink-0 flex-col items-center gap-1"
            aria-label={`Open story from ${user.username ?? user.name}`}
          >
            <span
              className={`rounded-full p-[3px] ${
                index > 2
                  ? "bg-neutral-300 dark:bg-neutral-700"
                  : "bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600"
              }`}
            >
              <span className="block rounded-full bg-white p-[2px] dark:bg-black">
                <Image
                  src={user.image ?? `https://i.pravatar.cc/120?u=${user.id}`}
                  alt={user.username ?? "user"}
                  width={64}
                  height={64}
                  className="h-16 w-16 rounded-full object-cover"
                />
              </span>
            </span>
            <span className="w-full truncate text-xs">
              {user.username ?? user.name}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
