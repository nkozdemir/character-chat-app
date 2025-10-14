"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/auth-context";

export default function ForgotPasswordPage() {
  const { requestPasswordReset, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading || submitting) return;

    if (!email.trim()) {
      setFormError("Please enter your email address.");
      return;
    }

    setFormError(null);
    setSuccessMessage(null);
    setSubmitting(true);

    try {
      await requestPasswordReset(email.trim());
      setSuccessMessage(
        "Password reset link sent! Check your inbox and follow the instructions.",
      );
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message.replace("Firebase: ", "")
          : "Unable to send reset email. Please try again.";
      setFormError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-12 text-white sm:px-6">
      <Background />

      <Card className="relative z-10 w-full max-w-lg border-white/10 bg-slate-900/75 p-8 text-center shadow-[0_30px_60px_-35px_rgba(14,165,233,0.45)] backdrop-blur-2xl">
        <CardContent className="space-y-6">
          <div className="space-y-3 text-left">
            <CardTitle className="text-3xl font-semibold leading-tight sm:text-4xl">
              Forgot password?
            </CardTitle>
            <CardDescription className="text-sm text-slate-300">
              Enter the email linked to your account and we&apos;ll send you a
              reset link.
            </CardDescription>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-left">
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

            {formError ? (
              <p className="text-xs font-medium text-rose-300">{formError}</p>
            ) : null}

            {successMessage ? (
              <p className="text-xs font-medium text-emerald-300">
                {successMessage}
              </p>
            ) : null}

            <Button
              type="submit"
              size="lg"
              variant="primary"
              disabled={loading || submitting}
              className="w-full rounded-full text-base"
            >
              {submitting ? "Sending…" : "Send reset link"}
            </Button>
          </form>

          <p className="text-xs text-slate-400">
            Remembered your password?{" "}
            <Link
              href="/"
              className="text-sky-200 underline-offset-4 transition hover:underline"
            >
              Back to sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function Background() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-500/30 blur-3xl" />
      <div className="absolute bottom-0 left-0 h-[320px] w-[320px] rounded-full bg-fuchsia-500/20 blur-3xl" />
    </div>
  );
}
