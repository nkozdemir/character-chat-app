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
  leftSlot?: React.ReactNode;
  rightSlotBare?: boolean;
};

export function AppShell({
  title,
  description,
  accent = "border-sky-500/50",
  children,
  className,
  rightSlot,
  leftSlot,
  rightSlotBare = false,
}: AppShellProps) {
  const headerTopOffset = "calc(env(safe-area-inset-top, 0px) + 0.75rem)";
  const headerSpacerHeight = title
    ? "calc(env(safe-area-inset-top, 0px) + 7.25rem)"
    : "calc(env(safe-area-inset-top, 0px) + 1.25rem)";

  return (
    <div className="relative mx-auto flex min-h-screen w-full max-w-3xl flex-col px-4 sm:px-6">
      {title ? (
        <>
          <m.header
            initial={{ y: -12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="pointer-events-none fixed left-1/2 z-30 w-full max-w-3xl -translate-x-1/2 px-4 sm:px-6"
            style={{ top: headerTopOffset }}
          >
            <div className="pointer-events-auto rounded-3xl border border-white/5 bg-white/5 px-5 py-4 shadow-[0_24px_64px_-40px_rgba(14,116,144,0.6)] backdrop-blur-2xl">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {leftSlot ? (
                    <m.div
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="shrink-0"
                    >
                      {leftSlot}
                    </m.div>
                  ) : null}
                  <div>
                    <h1 className="text-lg font-semibold text-slate-500 sm:text-xl">
                      {title}
                    </h1>
                    {description ? (
                      <p className="text-sm text-slate-400/80">{description}</p>
                    ) : null}
                  </div>
                </div>
                {rightSlot ? (
                  <m.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className={
                      rightSlotBare
                        ? undefined
                        : cn(
                            "rounded-full border bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-wide text-sky-500",
                            accent,
                          )
                    }
                  >
                    {rightSlot}
                  </m.div>
                ) : null}
              </div>
            </div>
          </m.header>
          <div aria-hidden style={{ height: headerSpacerHeight }} />
        </>
      ) : (
        <div aria-hidden style={{ height: headerSpacerHeight }} />
      )}

      <m.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className={cn(
          "flex-1 space-y-6 pb-[calc(env(safe-area-inset-bottom,0px)_+_5.5rem)] lg:pb-16",
          className,
        )}
      >
        {children}
      </m.main>

      <BottomNav />
    </div>
  );
}
