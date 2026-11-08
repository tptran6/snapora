import Image from "next/image";
import { posts } from "@/lib/data";
import { Heart, MessageCircle, Send } from "lucide-react";

export default function ReelsPage() {
  return (
    <div className="mx-auto max-w-[430px] space-y-4 p-4">
      {posts.slice(0, 4).map((post) => (
        <section
          key={post.id}
          className="relative overflow-hidden rounded-2xl bg-neutral-900"
        >
          <Image
            src={post.image}
            alt={post.caption}
            width={430}
            height={764}
            className="h-[764px] w-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Image
                src={post.user.avatar}
                alt={post.user.username}
                width={28}
                height={28}
                className="h-7 w-7 rounded-full object-cover"
              />
              {post.user.username}
            </div>
            <p className="mt-2 text-sm">{post.caption}</p>
          </div>
          <div className="absolute right-3 bottom-24 flex flex-col items-center gap-5 text-white">
            <Heart className="h-7 w-7" />
            <MessageCircle className="h-7 w-7" />
            <Send className="h-7 w-7" />
          </div>
        </section>
      ))}
    </div>
  );
}
