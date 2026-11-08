"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { signIn } from "next-auth/react";

const schema = z.object({
  name: z.string().min(1),
  username: z.string().min(3).regex(/^[a-zA-Z0-9._]+$/),
  email: z.string().email(),
  password: z.string().min(8),
});

type Values = z.infer<typeof schema>;

export default function RegisterPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<Values>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(values: Values) {
    setLoading(true);
    setError("");

    const response = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setError(data.error ?? "Could not create account");
      setLoading(false);
      return;
    }

    await signIn("credentials", {
      identifier: values.username,
      password: values.password,
      callbackUrl: "/",
    });
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-sm space-y-4 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-950"
      >
        <h1 className="text-center text-2xl font-semibold">Create account</h1>
        {error && <p className="text-center text-sm text-red-500">{error}</p>}
        <input {...register("name")} placeholder="Name" className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm dark:border-neutral-800 dark:bg-black" />
        {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
        <input {...register("username")} placeholder="Username" className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm dark:border-neutral-800 dark:bg-black" />
        {errors.username && <p className="text-xs text-red-500">{errors.username.message}</p>}
        <input {...register("email")} placeholder="Email" className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm dark:border-neutral-800 dark:bg-black" />
        {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
        <input {...register("password")} type="password" placeholder="Password" className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm dark:border-neutral-800 dark:bg-black" />
        {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
        <button disabled={loading} className="w-full rounded-lg bg-blue-500 py-2 text-sm font-semibold text-white disabled:opacity-60">
          {loading ? "Creating..." : "Sign up"}
        </button>
        <p className="text-center text-sm text-neutral-500">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-blue-500">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}
