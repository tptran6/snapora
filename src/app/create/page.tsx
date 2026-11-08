import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { createPost } from "@/app/actions";

export default async function CreatePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  return (
    <div className="mx-auto max-w-xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-semibold">Create post</h1>
      <form action={createPost} className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-black">
        <input
          name="imageUrl"
          placeholder="Image URL"
          className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm dark:border-neutral-800 dark:bg-black"
          required
        />
        <input
          name="caption"
          placeholder="Caption"
          className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm dark:border-neutral-800 dark:bg-black"
          required
        />
        <input
          name="location"
          placeholder="Location (optional)"
          className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm dark:border-neutral-800 dark:bg-black"
        />
        <button className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white">
          Share
        </button>
      </form>
    </div>
  );
}
