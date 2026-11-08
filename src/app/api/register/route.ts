import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "@/lib/prisma";

const registerSchema = z.object({
  name: z.string().min(1).max(60),
  username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9._]+$/),
  email: z.string().email(),
  password: z.string().min(8).max(100),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 },
    );
  }

  const { name, username, email, password } = parsed.data;

  const existing = await db.user.findFirst({
    where: { OR: [{ email }, { username }] },
  });

  if (existing) {
    return NextResponse.json(
      { error: "Email or username is already taken" },
      { status: 409 },
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await db.user.create({
    data: {
      name,
      username,
      email,
      passwordHash,
      image: `https://i.pravatar.cc/120?u=${username}`,
      bio: "New to Snapora",
    },
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}
