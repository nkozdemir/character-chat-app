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
import type { ChatSession } from "@/types/chat";

function mapChatSnapshot(snapshot: QuerySnapshot<DocumentData>): ChatSession[] {
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      characterId: data.characterId,
      characterName: data.characterName,
      characterSubtitle: data.characterSubtitle ?? "",
      characterEmoji: data.characterEmoji ?? "",
      characterGradient: data.characterGradient ?? "from-slate-600 to-slate-800",
      lastMessage: data.lastMessage ?? "",
      updatedAt: data.updatedAt?.toDate?.() ?? null,
      createdAt: data.createdAt?.toDate?.() ?? null,
    };
  });
}

export function useChats(userId: string | undefined) {
  const [chats, setChats] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<FirestoreError | null>(null);

  useEffect(() => {
    if (!userId) {
      setChats([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const chatsRef = collection(db, "users", userId, "chats");
    const chatsQuery = query(chatsRef, orderBy("updatedAt", "desc"));

    const unsubscribe = onSnapshot(
      chatsQuery,
      (snapshot) => {
        setChats(mapChatSnapshot(snapshot));
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [userId]);

  return useMemo(
    () => ({
      chats,
      loading,
      error,
    }),
    [chats, error, loading],
  );
}
