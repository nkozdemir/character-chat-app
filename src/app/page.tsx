"use client";

import { m } from "framer-motion";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/auth-context";

const features = [
  "Email-based accounts that sync instantly",
  "Realtime Groq-powered conversations",
  "Curated AI characters with distinct voices",
  "Smooth micro-interactions throughout",
];

export default function Home() {
  const router = useRouter();
  const { user, loading, signInWithEmail, signUpWithEmail } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      router.replace("/chat");
    }
  }, [loading, router, user]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading || submitting) return;
    setFormError(null);

    if (!email || !password) {
      setFormError("Please provide both email and password.");
      return;
    }

    setSubmitting(true);
    try {
      if (isRegister) {
        await signUpWithEmail(email.trim(), password);
      } else {
        await signInWithEmail(email.trim(), password);
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message.replace("Firebase: ", "")
          : "Unable to complete the request.";
      setFormError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-12 text-white sm:px-6">
      <GradientBackground />

      <m.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-lg"
      >
        <Card className="border-white/10 bg-slate-900/75 p-8 text-center shadow-[0_30px_60px_-35px_rgba(14,165,233,0.45)] backdrop-blur-2xl">
          <CardContent className="space-y-8">
            <div className="space-y-3">
              <Badge>Character.AI inspired</Badge>
              <CardTitle className="text-3xl font-semibold leading-tight sm:text-4xl">
                Chat with soulful AI companions
              </CardTitle>
              <CardDescription className="text-base text-slate-300">
                Pick a persona, trade thoughts, and enjoy an expressive messaging
                experience built for mobile delight.
              </CardDescription>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-left text-sm text-slate-200">
              <p className="text-xs uppercase tracking-wide text-sky-200/90">
                Inside the experience
              </p>
              <ul className="mt-3 space-y-2">
                {features.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm">
                    <span className="inline-flex h-2 w-2 rounded-full bg-sky-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label
                    htmlFor="email"
                    className="text-xs font-medium uppercase tracking-wide text-slate-200"
                  >
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    disabled={loading || submitting}
                  />
                </div>
                <div className="space-y-1.5">
                  <label
                    htmlFor="password"
                    className="text-xs font-medium uppercase tracking-wide text-slate-200"
                  >
                    Password
                  </label>
                  <Input
                    id="password"
                    type="password"
                    autoComplete={isRegister ? "new-password" : "current-password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Minimum 6 characters"
                    disabled={loading || submitting}
                  />
                </div>
              </div>

              {formError ? (
                <p className="text-xs font-medium text-rose-300">{formError}</p>
              ) : null}

              <Button
                type="submit"
                size="lg"
                variant="primary"
                disabled={loading || submitting}
                className="w-full rounded-full text-base"
              >
                {submitting
                  ? "Please wait…"
                  : isRegister
                    ? "Create account"
                    : "Sign in"}
              </Button>

              <p className="text-xs text-slate-400">
                {isRegister
                  ? "Already have an account?"
                  : "First time here?"}{" "}
                <button
                  type="button"
                  onClick={() => {
                    setIsRegister((state) => !state);
                    setFormError(null);
                  }}
                  className="text-sky-200 underline-offset-4 transition hover:underline"
                >
                  {isRegister ? "Sign in instead" : "Create an account"}
                </button>
              </p>
            </form>
          </CardContent>
        </Card>
      </m.div>
    </div>
  );
}

function GradientBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-500/30 blur-3xl" />
      <div className="absolute bottom-0 left-0 h-[320px] w-[320px] rounded-full bg-fuchsia-500/20 blur-3xl" />
      <m.div
        className="absolute right-0 top-24 h-[260px] w-[260px] rounded-full bg-blue-500/20 blur-3xl"
        animate={{ y: [0, 20, -10, 0], rotate: [0, 6, -4, 0] }}
        transition={{ repeat: Infinity, duration: 14, ease: "easeInOut" }}
      />
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-sky-400/30 bg-sky-400/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-sky-100">
      {children}
    </span>
  );
}
