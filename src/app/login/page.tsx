"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const schema = z.object({
  identifier: z.string().min(1, "Enter your email or username"),
  password: z.string().min(1, "Enter your password"),
});

type Values = z.infer<typeof schema>;

export default function LoginPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm<Values>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(values: Values) {
    setLoading(true);
    setError("");
    const result = await signIn("credentials", {
      ...values,
      redirect: false,
    });
    setLoading(false);

    if (result?.error) {
      setError("Invalid credentials");
      return;
    }
    router.push("/");
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-sm space-y-4 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-950"
      >
        <h1 className="text-center text-2xl font-semibold">Snapora</h1>
        {error && <p className="text-center text-sm text-red-500">{error}</p>}
        <input
          {...register("identifier")}
          placeholder="Email or username"
          className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm dark:border-neutral-800 dark:bg-black"
        />
        {errors.identifier && <p className="text-xs text-red-500">{errors.identifier.message}</p>}
        <input
          {...register("password")}
          type="password"
          placeholder="Password"
          className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm dark:border-neutral-800 dark:bg-black"
        />
        {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
        <button
          disabled={loading}
          className="w-full rounded-lg bg-blue-500 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Log in"}
        </button>
        <p className="text-center text-sm text-neutral-500">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-semibold text-blue-500">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}
