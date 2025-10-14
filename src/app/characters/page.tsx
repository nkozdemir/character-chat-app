"use client";

import { KeyboardEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { m } from "framer-motion";
import { Sparkles, Loader2 } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { ensureChatSession } from "@/lib/chat-actions";
import { characters } from "@/lib/characters";

export default function CharactersPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [joiningId, setJoiningId] = useState<string | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/");
    }
  }, [authLoading, router, user]);

  useEffect(
    () => () => {
      isMountedRef.current = false;
    },
    [],
  );

  const handleSelect = (characterId: string) => {
    if (!user) return;
    const character = characters.find((item) => item.id === characterId);
    if (!character) return;
    setJoiningId(characterId);
    router.push(`/chat/${character.id}`);

    void ensureChatSession(user.uid, character)
      .catch((error) => {
        console.error("Failed to prepare chat session", error);
      })
      .finally(() => {
        if (!isMountedRef.current) return;
        setJoiningId((current) => (current === characterId ? null : current));
      });
  };

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center text-slate-300">
        Loading…
      </div>
    );
  }

  return (
    <AppShell
      title="Choose a character"
      description="Each persona brings a unique tone, pacing, and conversation mood."
      rightSlot={<Sparkles className="h-4 w-4" />}
      className="space-y-6"
    >
      <div className="grid gap-4 md:grid-cols-2">
        {characters.map((character, index) => (
          <m.div
            key={character.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.35 }}
            onClick={() => handleSelect(character.id)}
            onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                handleSelect(character.id);
              }
            }}
            className="group flex h-full flex-col rounded-3xl border border-white/10 bg-white/5 p-5 text-left shadow-[0_32px_58px_-38px_rgba(59,130,246,0.4)] backdrop-blur-xl transition hover:border-white/20 hover:bg-white/10"
            role="button"
            tabIndex={0}
          >
            <div className="flex items-start gap-4">
              <Avatar
                alt={character.name}
                gradient={character.gradient}
                fallback={character.avatarEmoji}
                size="lg"
              />
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-slate-500">
                  {character.name}
                </h3>
                <p className="text-xs uppercase tracking-wide text-slate-400/80">
                  {character.subtitle}
                </p>
                <p className="text-sm text-slate-400/90">
                  {character.systemPrompt}
                </p>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-between">
              <span className="rounded-full border border-slate/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-wide text-slate-400">
                {character.tone}
              </span>
              <Button
                size="sm"
                variant="secondary"
                onClick={(event) => {
                  event.stopPropagation();
                  handleSelect(character.id);
                }}
                disabled={joiningId === character.id}
              >
                {joiningId === character.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Enter chat"
                )}
              </Button>
            </div>
          </m.div>
        ))}
      </div>
    </AppShell>
  );
}
