import { AppShell } from "@/components/layout/app-shell";
import { Skeleton } from "@/components/ui/skeleton";

export default function ChatDetailLoading() {
  return (
    <AppShell
      title="Opening chat"
      description="Setting the vibe…"
      className="flex flex-col gap-6"
    >
      <div className="flex flex-1 flex-col gap-4">
        <div className="grow space-y-4 rounded-3xl border border-white/10 bg-white/5 p-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className={`flex w-full gap-3 ${
                index % 2 === 0 ? "justify-start" : "justify-end"
              }`}
            >
              {index % 2 === 0 ? (
                <Skeleton className="h-9 w-9 rounded-full" />
              ) : null}
              <div className="space-y-2">
                <Skeleton className="h-3 rounded-full" />
                <Skeleton className="h-3 rounded-full" />
              </div>
            </div>
          ))}
        </div>
        <Skeleton className="h-12 rounded-full" />
      </div>
    </AppShell>
  );
}
