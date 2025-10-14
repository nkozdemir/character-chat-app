import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import type { Character } from "@/lib/characters";
import { db } from "@/lib/firebase";

export async function ensureChatSession(
  userId: string,
  character: Character,
) {
  const chatDocRef = doc(db, "users", userId, "chats", character.id);

  const snapshot = await getDoc(chatDocRef);

  if (!snapshot.exists()) {
    await setDoc(chatDocRef, {
      characterId: character.id,
      characterName: character.name,
      characterSubtitle: character.subtitle,
      characterEmoji: character.avatarEmoji,
      characterGradient: character.gradient,
      lastMessage: "",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } else {
    await updateDoc(chatDocRef, {
      characterName: character.name,
      characterSubtitle: character.subtitle,
      characterEmoji: character.avatarEmoji,
      characterGradient: character.gradient,
      updatedAt: serverTimestamp(),
    });
  }

  return chatDocRef;
}

export async function addUserMessage(
  userId: string,
  chatId: string,
  content: string,
) {
  const messagesRef = collection(
    db,
    "users",
    userId,
    "chats",
    chatId,
    "messages",
  );

  await addDoc(messagesRef, {
    chatId,
    role: "user",
    content,
    createdAt: serverTimestamp(),
  });

  const chatDocRef = doc(db, "users", userId, "chats", chatId);
  await updateDoc(chatDocRef, {
    lastMessage: content,
    updatedAt: serverTimestamp(),
  });
}

export async function addAssistantMessage(
  userId: string,
  chatId: string,
  content: string,
) {
  const messagesRef = collection(
    db,
    "users",
    userId,
    "chats",
    chatId,
    "messages",
  );

  await addDoc(messagesRef, {
    chatId,
    role: "assistant",
    content,
    createdAt: serverTimestamp(),
  });

  const chatDocRef = doc(db, "users", userId, "chats", chatId);
  await updateDoc(chatDocRef, {
    lastMessage: content,
    updatedAt: serverTimestamp(),
  });
}
