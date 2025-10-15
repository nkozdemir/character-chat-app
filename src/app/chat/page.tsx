"use client";

import { AnimatePresence, m } from "framer-motion";
import { useEffect, useState, type KeyboardEvent, type MouseEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2, MessageCirclePlus, MoreHorizontal, Trash2 } from "lucide-react";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/auth-context";
import { deleteChat } from "@/lib/chat-actions";
import { formatRelativeTime } from "@/lib/utils";
import { useChats } from "@/hooks/use-chats";
import { characters } from "@/lib/characters";

export default function ChatListPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { chats, loading: chatsLoading } = useChats(user?.uid);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [deletingChatId, setDeletingChatId] = useState<string | null>(null);

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

  const handleChatNavigate = (characterId: string) => {
    setActiveMenuId(null);
    router.push(`/chat/${characterId}`);
  };

  const handleChatKeyDown = (
    event: KeyboardEvent<HTMLDivElement>,
    characterId: string,
  ) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleChatNavigate(characterId);
    }
  };

  const handleOptionsToggle = (event: MouseEvent<HTMLButtonElement>, chatId: string) => {
    event.stopPropagation();
    setActiveMenuId((previous) => (previous === chatId ? null : chatId));
  };

  const handleDeleteChat = async (
    event: MouseEvent<HTMLButtonElement>,
    chatId: string,
    characterName: string,
  ) => {
    event.stopPropagation();
    if (!user) return;

    const confirmed = window.confirm(
      `Delete your chat with ${characterName}? This cannot be undone.`,
    );

    if (!confirmed) {
      setActiveMenuId(null);
      return;
    }

    setDeletingChatId(chatId);

    try {
      await deleteChat(user.uid, chatId);
    } catch (error) {
      console.error("Failed to delete chat", error);
      window.alert("Could not delete this chat. Please try again.");
    } finally {
      setDeletingChatId(null);
      setActiveMenuId(null);
    }
  };

  return (
    <AppShell
      title="Your chats"
      description="Pick up where you left off with any character."
      rightSlot={
        <Link
          href="/characters"
          className="flex h-6 w-6 items-center justify-center"
        >
          <MessageCirclePlus className="h-4 w-4" />
          <span className="sr-only">New chat</span>
        </Link>
      }
    >
      <section className="space-y-4">
        {chatsLoading ? (
          <ChatSkeletonList />
        ) : chats.length ? (
          chats.map((chat, index) => (
            <m.div
              key={chat.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04, duration: 0.35 }}
              onClick={() => handleChatNavigate(chat.characterId)}
              onKeyDown={(event) => handleChatKeyDown(event, chat.characterId)}
              role="button"
              tabIndex={0}
              className="relative flex w-full cursor-pointer flex-col rounded-3xl border border-white/10 bg-white/5 p-4 text-left shadow-[0_30px_50px_-38px_rgba(14,165,233,0.55)] backdrop-blur-xl transition hover:border-white/20 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            >
              <div className="flex items-center gap-4">
                <Avatar
                  alt={chat.characterName}
                  gradient={chat.characterGradient}
                  fallback={chat.characterEmoji}
                  size="md"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-base font-semibold text-slate-500">
                        {chat.characterName}
                      </p>
                      <p className="text-xs uppercase tracking-wide text-slate-400/75">
                        {chat.characterSubtitle}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {chat.updatedAt ? (
                        <span className="text-xs text-slate-400">
                          {formatRelativeTime(chat.updatedAt)}
                        </span>
                      ) : null}
                      <div className="relative">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 rounded-full p-0 text-slate-400 hover:text-slate-200"
                          onClick={(event) => handleOptionsToggle(event, chat.id)}
                          aria-haspopup="true"
                          aria-expanded={activeMenuId === chat.id}
                          aria-label={`Chat options for ${chat.characterName}`}
                        >
                          <MoreHorizontal className="h-4 w-4" aria-hidden />
                        </Button>
                        <AnimatePresence>
                          {activeMenuId === chat.id ? (
                            <m.div
                              initial={{ opacity: 0, y: -4 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -4 }}
                              transition={{ duration: 0.15 }}
                              className="absolute right-0 top-9 z-10 w-36 rounded-2xl border border-white/10 bg-slate-900/95 p-2 shadow-xl backdrop-blur-md"
                            >
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="w-full justify-start gap-2 text-sm text-rose-300 hover:bg-rose-500/10 hover:text-rose-200"
                                onClick={(event) =>
                                  handleDeleteChat(event, chat.id, chat.characterName)
                                }
                                disabled={deletingChatId === chat.id}
                              >
                                {deletingChatId === chat.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                                ) : (
                                  <Trash2 className="h-4 w-4" aria-hidden />
                                )}
                                <span>Delete chat</span>
                              </Button>
                            </m.div>
                          ) : null}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>
                  <p className="mt-3 line-clamp-2 text-sm text-slate-400/90">
                    {chat.lastMessage || "No messages yet. Tap to start talking."}
                  </p>
                </div>
              </div>
            </m.div>
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
      <MessageCirclePlus className="h-4 w-4 text-sky-300" />
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-white">Start your first chat</h3>
        <p className="text-sm text-slate-400/85">
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
