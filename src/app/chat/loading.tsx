import { AppShell } from "@/components/layout/app-shell";
import { Skeleton } from "@/components/ui/skeleton";

export default function ChatPageLoading() {
  return (
    <AppShell
      title="Loading chats"
      description="Syncing your characters…"
      rightSlot={<span className="text-xs text-slate-200">•••</span>}
    >
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="flex items-center gap-4 rounded-3xl border border-white/10 bg-white/5 p-4"
          >
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="flex-1 space-y-3">
              <Skeleton className="h-3.5 w-1/2 rounded-full" />
              <Skeleton className="h-2.5 w-3/4 rounded-full" />
              <Skeleton className="h-2.5 w-full rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
