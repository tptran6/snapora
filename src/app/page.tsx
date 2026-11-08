import StoryBar from "@/components/StoryBar";
import PostCard from "@/components/PostCard";
import Suggestions from "@/components/Suggestions";
import { getFeedPosts } from "@/lib/feed";

export default async function HomePage() {
  const posts = await getFeedPosts();

  return (
    <div className="flex justify-center gap-8 px-0 py-0 md:px-6 md:py-6">
      <div className="min-w-0 flex-1 max-w-[630px]">
        <div className="overflow-hidden rounded-none border border-neutral-200 bg-white md:rounded-xl dark:border-neutral-800 dark:bg-black">
          <StoryBar />
        </div>
        <div className="mt-4 space-y-4 md:mt-6">
          {posts.map((post) => (
            <div
              key={post.id}
              className="overflow-hidden rounded-none border border-neutral-200 bg-white md:rounded-xl dark:border-neutral-800 dark:bg-black"
            >
              <PostCard post={post} />
            </div>
          ))}
        </div>
      </div>
      <Suggestions />
    </div>
  );
}
