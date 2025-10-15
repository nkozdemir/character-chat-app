"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  use as usePromise,
} from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, m } from "framer-motion";
import { ArrowLeft, Loader2, Send } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/auth-context";
import {
  addAssistantMessage,
  addUserMessage,
  ensureChatSession,
} from "@/lib/chat-actions";
import { getCharacter } from "@/lib/characters";
import { useMessages } from "@/hooks/use-messages";
import type { ChatMessage } from "@/types/chat";

export default function CharacterChatPage({
  params,
}: {
  params: Promise<{ characterId: string }>;
}) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { characterId } = usePromise(params);
  const character = useMemo(
    () => getCharacter(characterId),
    [characterId],
  );
  const { messages, loading: messagesLoading } = useMessages(user?.uid, character?.id);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [streamingMessage, setStreamingMessage] =
    useState<ChatMessage | null>(null);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);
  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/characters");
    }
  };

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/");
    }
  }, [authLoading, router, user]);

  useEffect(() => {
    if (!character && !authLoading) {
      router.replace("/characters");
    }
  }, [authLoading, character, router]);

  useEffect(() => {
    if (user && character) {
      ensureChatSession(user.uid, character).catch((err) => {
        console.error("Failed to ensure chat session", err);
      });
    }
  }, [character, user]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingMessage]);

  if (!user || !character) {
    return (
      <div className="flex min-h-screen items-center justify-center text-slate-300">
        Loading…
      </div>
    );
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!input.trim() || isSending) return;

    const content = input.trim();
    setInput("");
    setError(null);
    setIsSending(true);

    try {
      await addUserMessage(user.uid, character.id, content);
    } catch (err) {
      console.error("Failed to write user message", err);
      setError("Could not send your message. Please try again.");
      setIsSending(false);
      setInput(content);
      return;
    }

    try {
      const history = messages
        .filter((message) => !!message.content)
        .map((message) => ({
          role: message.role,
          content: message.content,
        }));

      history.push({ role: "user", content });

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          characterId: character.id,
          systemPrompt: character.systemPrompt,
          messages: history,
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error("Failed to receive response");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantContent = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        assistantContent += chunk;
        setStreamingMessage({
          id: "streaming",
          chatId: character.id,
          role: "assistant",
          content: assistantContent,
          createdAt: new Date(),
          streaming: true,
        });
      }

      setStreamingMessage(null);

      if (assistantContent.trim()) {
        await addAssistantMessage(
          user.uid,
          character.id,
          assistantContent.trim(),
        );
      }
    } catch (err) {
      console.error("Groq request failed", err);
      setError("The AI response timed out. Try again in a moment.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <AppShell
      title={character.name}
      description={character.subtitle}
      leftSlot={
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleBack}
          className="px-3 text-slate-500 hover:bg-slate-400/10 hover:text-slate-400"
          aria-label="Go back"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
      }
      rightSlotBare
      rightSlot={
        <span className="text-xl" aria-hidden>
          {character.avatarEmoji}
        </span>
      }
      className="flex flex-col gap-6"
    >
      <div className="flex flex-1 flex-col gap-4">
        <div className="grow space-y-4 overflow-y-auto rounded-3xl border border-white/10 bg-white/5 p-4 pb-28 backdrop-blur-xl">
          {messagesLoading ? (
            <MessageSkeleton />
          ) : (
            <AnimatePresence initial={false}>
              {messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isOwn={message.role === "user"}
                  characterEmoji={character.avatarEmoji}
                />
              ))}
              {streamingMessage ? (
                <MessageBubble
                  key="streaming"
                  message={streamingMessage}
                  isOwn={false}
                  characterEmoji={character.avatarEmoji}
                  streaming
                />
              ) : null}
            </AnimatePresence>
          )}
          <div ref={endRef} />
        </div>

        <div className="sticky bottom-[calc(env(safe-area-inset-bottom,0px)+4.75rem)] z-20 flex-shrink-0">
          <form
            onSubmit={handleSubmit}
            className="space-y-3 rounded-[1.75rem] border border-white/10 p-4 shadow-[0_24px_60px_-40px_rgba(14,165,233,0.5)] backdrop-blur-xl"
          >
            {error ? <p className="text-xs text-rose-300">{error}</p> : null}
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder={`Message ${character.name}`}
                disabled={isSending}
              />
              <Button
                type="submit"
                size="lg"
                className="h-12 w-20 rounded-full"
                disabled={isSending || !input.trim()}
              >
                {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
            <TypingIndicator active={isSending || !!streamingMessage} />
          </form>
        </div>
      </div>
    </AppShell>
  );
}

function MessageBubble({
  message,
  isOwn,
  streaming,
  characterEmoji,
}: {
  message: ChatMessage;
  isOwn: boolean;
  streaming?: boolean;
  characterEmoji: string;
}) {
  return (
    <m.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 6 }}
      transition={{ duration: 0.25 }}
      className={`flex w-full gap-3 ${isOwn ? "justify-end" : ""}`}
    >
      {!isOwn ? (
        <span className="mt-1 text-xl" aria-hidden>
          {characterEmoji}
        </span>
      ) : null}
      <div
        className={`max-w-[78%] rounded-3xl px-4 py-3 text-sm leading-relaxed shadow-lg ${
          isOwn
            ? "rounded-br-md bg-sky-500/90 text-white"
            : "rounded-bl-md border border-white/20 bg-white/80 text-slate-900 backdrop-blur-md"
        }`}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
        {streaming ? (
          <span className="mt-2 inline-flex h-2 w-2 animate-pulse rounded-full bg-sky-200" />
        ) : null}
      </div>
    </m.div>
  );
}

function TypingIndicator({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <div className="flex items-center gap-2 text-xs text-slate-300">
      <span className="inline-flex h-2 w-2 animate-ping rounded-full bg-sky-400" />
      AI is composing a response…
    </div>
  );
}

function MessageSkeleton() {
  return (
    <div className="space-y-4">
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
            <Skeleton
              className="h-3 rounded-full"
              style={{ width: `${60 - index * 8}%` }}
            />
            <Skeleton
              className="h-3 rounded-full"
              style={{ width: `${50 - index * 6}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
