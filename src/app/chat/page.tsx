"use client";

import { m } from "framer-motion";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { MessageCirclePlus } from "lucide-react";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/auth-context";
import { formatRelativeTime } from "@/lib/utils";
import { useChats } from "@/hooks/use-chats";
import { characters } from "@/lib/characters";

export default function ChatListPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { chats, loading: chatsLoading } = useChats(user?.uid);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/");
    }
  }, [authLoading, router, user]);

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center text-slate-300">
        Loading…
      </div>
    );
  }

  return (
    <AppShell
      title="Your chats"
      description="Pick up where you left off with any character."
      rightSlot={<Link href="/characters">New chat</Link>}
    >
      <section className="space-y-4">
        {chatsLoading ? (
          <ChatSkeletonList />
        ) : chats.length ? (
          chats.map((chat, index) => (
            <m.button
              key={chat.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04, duration: 0.35 }}
              onClick={() => router.push(`/chat/${chat.characterId}`)}
              className="flex w-full flex-col rounded-3xl border border-white/10 bg-white/5 p-4 text-left shadow-[0_30px_50px_-38px_rgba(14,165,233,0.55)] backdrop-blur-xl transition hover:border-white/20 hover:bg-white/10"
            >
              <div className="flex items-center gap-4">
                <Avatar
                  alt={chat.characterName}
                  gradient={chat.characterGradient}
                  fallback={chat.characterEmoji}
                  size="md"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-base font-semibold text-white">
                        {chat.characterName}
                      </p>
                      <p className="text-xs uppercase tracking-wide text-slate-300/75">
                        {chat.characterSubtitle}
                      </p>
                    </div>
                    {chat.updatedAt ? (
                      <span className="text-xs text-slate-400">
                        {formatRelativeTime(chat.updatedAt)}
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-3 line-clamp-2 text-sm text-slate-300/90">
                    {chat.lastMessage || "No messages yet. Tap to start talking."}
                  </p>
                </div>
              </div>
            </m.button>
          ))
        ) : (
          <EmptyState />
        )}
      </section>
    </AppShell>
  );
}

function EmptyState() {
  return (
    <m.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center gap-6 rounded-3xl border border-dashed border-white/20 bg-white/5 px-6 py-10 text-center text-slate-300"
    >
      <MessageCirclePlus className="h-10 w-10 text-sky-300" />
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-white">Start your first chat</h3>
        <p className="text-sm text-slate-300/85">
          Pick a character to explore a unique conversational vibe. Your history syncs instantly once you send a message.
        </p>
      </div>
      <div className="flex w-full flex-col gap-3">
        <Button asChild size="lg" className="w-full">
          <Link href={`/chat/${characters[0]?.id}`}>Quick start with {characters[0]?.name}</Link>
        </Button>
        <Button asChild variant="secondary" size="lg">
          <Link href="/characters">Browse characters</Link>
        </Button>
      </div>
    </m.div>
  );
}

function ChatSkeletonList() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 4 }, (_, index) => (
        <m.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: index * 0.05 }}
          className="flex items-center gap-4 rounded-3xl border border-white/10 bg-white/5 p-4"
        >
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-3.5 w-1/2 rounded-full" />
            <Skeleton className="h-2.5 w-3/4 rounded-full" />
            <Skeleton className="h-2.5 w-full rounded-full" />
          </div>
        </m.div>
      ))}
    </div>
  );
}
