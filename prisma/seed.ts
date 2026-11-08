import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("password123", 12);

  const me = await db.user.upsert({
    where: { username: "you" },
    update: {},
    create: {
      name: "You",
      username: "you",
      email: "you@example.com",
      passwordHash,
      image: "https://i.pravatar.cc/120?img=12",
      bio: "Building Snapora",
    },
  });

  const users = [];
  for (let i = 1; i <= 6; i++) {
    const user = await db.user.upsert({
      where: { username: `user${i}` },
      update: {},
      create: {
        name: `User ${i}`,
        username: `user${i}`,
        email: `user${i}@example.com`,
        passwordHash,
        image: `https://i.pravatar.cc/120?img=${i}`,
        bio: "Photography and travel",
      },
    });
    users.push(user);
  }

  // Follow suggestions.
  for (const user of users.slice(0, 4)) {
    await db.follow.upsert({
      where: { followerId_followingId: { followerId: me.id, followingId: user.id } },
      update: {},
      create: { followerId: me.id, followingId: user.id },
    });
  }

  const captions = [
    "Sunrise hike and coffee before the city wakes up.",
    "New print series. Which frame is your favorite?",
    "Quiet streets and loud colors.",
    "Weekend project finally finished.",
    "Golden hour does all the work.",
    "Market mornings.",
  ];

  for (let i = 0; i < captions.length; i++) {
    const author = users[i % users.length];
    await db.post.create({
      data: {
        caption: captions[i],
        imageUrl: `https://picsum.photos/seed/p${i + 1}/900/1125`,
        location: ["Portland", "Lisbon", "Brooklyn", "Mexico City"][i % 4],
        userId: author.id,
        likes: {
          create: [{ userId: me.id }],
        },
        comments: {
          create: [
            { body: "This looks incredible.", userId: me.id },
            { body: "Take me there next time.", userId: users[(i + 1) % users.length].id },
          ],
        },
      },
    });
  }

  console.log("Seed complete. Login: you / password123");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
