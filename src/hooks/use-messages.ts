"use client";

import { useEffect, useMemo, useState } from "react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  type FirestoreError,
  type QuerySnapshot,
  type DocumentData,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { ChatMessage } from "@/types/chat";

function mapMessagesSnapshot(
  snapshot: QuerySnapshot<DocumentData>,
): ChatMessage[] {
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      chatId: data.chatId ?? "",
      role: data.role,
      content: data.content,
      createdAt: data.createdAt?.toDate?.() ?? null,
    };
  });
}

export function useMessages(
  userId: string | undefined,
  chatId: string | undefined,
) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<FirestoreError | null>(null);

  useEffect(() => {
    if (!userId || !chatId) {
      setMessages([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const messagesRef = collection(
      db,
      "users",
      userId,
      "chats",
      chatId,
      "messages",
    );
    const messagesQuery = query(messagesRef, orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(
      messagesQuery,
      (snapshot) => {
        setMessages(mapMessagesSnapshot(snapshot));
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [chatId, userId]);

  return useMemo(
    () => ({
      messages,
      loading,
      error,
    }),
    [messages, loading, error],
  );
}
