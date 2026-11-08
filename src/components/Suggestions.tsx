import Link from "next/link";
import Image from "next/image";
import { currentUser } from "@/lib/data";
import { auth } from "@/auth";
import { getSuggestedUsers } from "@/lib/feed";

export default async function Suggestions() {
  const session = await auth();
  const users = await getSuggestedUsers();
  const me = session?.user;

  return (
    <aside className="hidden w-[320px] shrink-0 py-8 lg:block">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image
            src={me?.image ?? currentUser.avatar}
            alt={me?.username ?? currentUser.username}
            width={44}
            height={44}
            className="h-11 w-11 rounded-full object-cover"
          />
          <div className="leading-tight">
            <div className="text-sm font-semibold">{me?.username ?? currentUser.username}</div>
            <div className="text-sm text-neutral-500">{me?.name ?? currentUser.name}</div>
          </div>
        </div>
      </div>

      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-semibold text-neutral-500">
          Suggested for you
        </span>
      </div>

      <ul className="space-y-3">
        {users.map((user) => (
          <li key={user.id} className="flex items-center justify-between">
            <Link href={`/profile/${user.username}`} className="flex items-center gap-3">
              <Image
                src={user.avatar}
                alt={user.username}
                width={36}
                height={36}
                className="h-9 w-9 rounded-full object-cover"
              />
              <div className="leading-tight">
                <div className="text-sm font-semibold">{user.username}</div>
                <div className="text-xs text-neutral-500">Suggested for you</div>
              </div>
            </Link>
            <button className="text-xs font-semibold text-blue-500">Follow</button>
          </li>
        ))}
      </ul>

      <footer className="mt-8 text-xs text-neutral-400">
        © 2025 Snapora Clone
      </footer>
    </aside>
  );
}
