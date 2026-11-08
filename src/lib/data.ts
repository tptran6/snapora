export type Comment = {
  id: string;
  user: string;
  text: string;
};

export type User = {
  id: string;
  username: string;
  name: string;
  avatar: string;
  verified?: boolean;
};

export type Post = {
  id: string;
  user: User;
  image: string;
  caption: string;
  likes: number;
  liked?: boolean;
  location?: string;
  createdAt: string;
  comments: Comment[];
};

export type Story = {
  id: string;
  user: User;
  image: string;
  seen: boolean;
};

export const currentUser: User = {
  id: "me",
  username: "you",
  name: "You",
  avatar: "https://i.pravatar.cc/120?img=12",
};

const u = (n: number, name: string, username: string): User => ({
  id: `u${n}`,
  username,
  name,
  avatar: `https://i.pravatar.cc/120?img=${n}`,
  verified: n % 3 === 0,
});

export const users: User[] = [
  u(1, "Lina Rivers", "lina.rivers"),
  u(2, "Marco Vale", "marco.vale"),
  u(3, "Nina Park", "nina.park"),
  u(4, "Theo Miles", "theo.miles"),
  u(5, "Ava Stone", "ava.stone"),
  u(6, "Diego Cruz", "diego.cruz"),
];

export const stories: Story[] = [
  { id: "s0", user: currentUser, image: "https://picsum.photos/seed/story0/180/300", seen: false },
  ...users.map((user, i) => ({
    id: `s${i + 1}`,
    user,
    image: `https://picsum.photos/seed/story${i + 1}/180/300`,
    seen: i > 2,
  })),
];

const commentsFor = (names: string[]): Comment[] =>
  names.map((name, i) => ({
    id: `${name}-${i}`,
    user: name,
    text: [
      "This looks incredible.",
      "Take me there next time.",
      "Obsessed with this.",
      "The light in this is perfect.",
    ][i % 4],
  }));

export const posts: Post[] = [
  {
    id: "p1",
    user: users[0],
    image: "https://picsum.photos/seed/p1/900/1125",
    caption: "Sunrise hike and coffee before the city wakes up.",
    likes: 1284,
    location: "Portland, Oregon",
    createdAt: "2 hours ago",
    comments: commentsFor(["marco.vale", "ava.stone"]),
  },
  {
    id: "p2",
    user: users[1],
    image: "https://picsum.photos/seed/p2/900/900",
    caption: "New print series. Which frame is your favorite?",
    likes: 892,
    location: "Lisbon",
    createdAt: "4 hours ago",
    comments: commentsFor(["nina.park"]),
  },
  {
    id: "p3",
    user: users[2],
    image: "https://picsum.photos/seed/p3/900/1200",
    caption: "Quiet streets and loud colors.",
    likes: 2103,
    createdAt: "6 hours ago",
    comments: commentsFor(["theo.miles", "diego.cruz", "lina.rivers"]),
  },
  {
    id: "p4",
    user: users[3],
    image: "https://picsum.photos/seed/p4/900/720",
    caption: "Weekend project finally finished.",
    likes: 451,
    location: "Brooklyn",
    createdAt: "9 hours ago",
    comments: commentsFor(["ava.stone"]),
  },
  {
    id: "p5",
    user: users[4],
    image: "https://picsum.photos/seed/p5/900/1125",
    caption: "Golden hour does all the work.",
    likes: 3021,
    createdAt: "1 day ago",
    comments: commentsFor(["marco.vale", "diego.cruz"]),
  },
  {
    id: "p6",
    user: users[5],
    image: "https://picsum.photos/seed/p6/900/900",
    caption: "Market mornings.",
    likes: 778,
    location: "Mexico City",
    createdAt: "1 day ago",
    comments: commentsFor(["lina.rivers"]),
  },
];

export const suggestedUsers: User[] = users.slice(0, 4);

export const profileStats = {
  posts: posts.filter((post) => post.user.id === "u1").length + 12,
  followers: 12480,
  following: 312,
};
