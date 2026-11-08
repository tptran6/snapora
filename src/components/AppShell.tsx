"use client";

import { SessionProvider, useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Home,
  Search,
  PlusSquare,
  Film,
  Send,
  Heart,
  User,
  Compass,
  Menu,
} from "lucide-react";
import { currentUser } from "@/lib/data";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/search", label: "Search", icon: Search },
  { href: "/explore", label: "Explore", icon: Compass },
  { href: "/reels", label: "Reels", icon: Film },
  { href: "/messages", label: "Messages", icon: Send },
  { href: "/create", label: "Create", icon: PlusSquare },
  { href: "/notifications", label: "Notifications", icon: Heart },
  { href: `/profile/${currentUser.username}`, label: "Profile", icon: User },
];

function AppShellInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const authRoute = pathname === "/login" || pathname === "/register";
  if (authRoute) return <>{children}</>;

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-950 dark:bg-black dark:text-neutral-100">
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-neutral-200 bg-white/80 px-4 py-3 backdrop-blur md:hidden dark:border-neutral-800 dark:bg-black/80">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          Snapora
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/notifications" aria-label="Notifications">
            <Heart className="h-6 w-6" />
          </Link>
          <Link href="/messages" aria-label="Messages">
            <Send className="h-6 w-6" />
          </Link>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1320px]">
        <aside className="sticky top-0 hidden h-screen w-[78px] flex-col border-r border-neutral-200 bg-white py-6 lg:w-[245px] md:flex dark:border-neutral-800 dark:bg-black">
          <Link href="/" className="mb-8 px-4 text-2xl font-semibold tracking-tight lg:px-6">
            <span className="hidden lg:inline">Snapora</span>
            <span className="lg:hidden">S</span>
          </Link>
          <nav className="flex flex-col gap-1 px-2">
            {navItems.map((item) => {
              const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-4 rounded-xl px-3 py-3 text-sm transition-colors ${
                    active ? "font-semibold" : "hover:bg-neutral-100 dark:hover:bg-neutral-900"
                  }`}
                >
                  <Icon className="h-6 w-6 shrink-0" strokeWidth={active ? 2.5 : 1.8} />
                  <span className="hidden lg:inline">{item.label}</span>
                </Link>
              );
            })}
          </nav>
          {session?.user ? (
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="mt-auto flex items-center gap-4 rounded-xl px-3 py-3 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-900"
            >
              <Menu className="h-6 w-6 shrink-0" />
              <span className="hidden lg:inline">Sign out ({session.user.username ?? session.user.name})</span>
            </button>
          ) : (
            <Link
              href="/login"
              className="mt-auto flex items-center gap-4 rounded-xl px-3 py-3 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-900"
            >
              <Menu className="h-6 w-6 shrink-0" />
              <span className="hidden lg:inline">Log in</span>
            </Link>
          )}
        </aside>

        <main className="min-w-0 flex-1 pb-16 md:pb-0">{children}</main>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-neutral-200 bg-white/95 py-2 backdrop-blur md:hidden dark:border-neutral-800 dark:bg-black/95">
        {navItems.slice(0, 5).concat(navItems[7]).map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} className="p-2">
              <Icon className="h-6 w-6" strokeWidth={active ? 2.5 : 1.8} />
            </Link>
          );
        })}
      </nav>
    </div>
  );
}


export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AppShellInner>{children}</AppShellInner>
    </SessionProvider>
  );
}
