"use client";

import { m } from "framer-motion";
import { BottomNav } from "@/components/navigation/bottom-nav";
import { cn } from "@/lib/utils";

type AppShellProps = {
  title?: string;
  description?: string;
  accent?: string;
  children: React.ReactNode;
  className?: string;
  rightSlot?: React.ReactNode;
};

export function AppShell({
  title,
  description,
  accent = "border-sky-500/50",
  children,
  className,
  rightSlot,
}: AppShellProps) {
  return (
    <div className="relative mx-auto flex min-h-screen w-full max-w-3xl flex-col px-4 pb-28 pt-6 sm:px-6">
      {title ? (
        <m.header
          initial={{ y: -12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="rounded-3xl border border-white/5 bg-white/5 px-5 py-4 shadow-[0_24px_64px_-40px_rgba(14,116,144,0.6)] backdrop-blur-2xl"
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-lg font-semibold text-slate-400 sm:text-xl">
                {title}
              </h1>
              {description ? (
                <p className="text-sm text-slate-400/80">{description}</p>
              ) : null}
            </div>
            {rightSlot ? (
              <m.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className={cn(
                  "rounded-full border bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-wide text-sky-300",
                  accent,
                )}
              >
                {rightSlot}
              </m.div>
            ) : null}
          </div>
        </m.header>
      ) : null}

      <m.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className={cn("mt-6 flex-1 space-y-6", className)}
      >
        {children}
      </m.main>

      <BottomNav />
    </div>
  );
}
