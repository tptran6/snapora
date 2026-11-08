import Image from "next/image";
import { posts } from "@/lib/data";

export default function ExplorePage() {
  const items = [...posts, ...posts].slice(0, 15);
  return (
    <div className="p-1 md:p-6">
      <div className="grid grid-cols-3 gap-1 md:gap-4">
        {items.map((post, index) => (
          <div
            key={`${post.id}-${index}`}
            className={`relative overflow-hidden rounded-sm bg-neutral-100 dark:bg-neutral-900 ${
              index % 7 === 0 ? "col-span-2 row-span-2" : ""
            }`}
          >
            <Image
              src={post.image}
              alt={post.caption}
              width={400}
              height={400}
              className="h-full w-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
