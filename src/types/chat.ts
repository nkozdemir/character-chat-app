export type ChatSession = {
  id: string;
  characterId: string;
  characterName: string;
  characterSubtitle: string;
  characterEmoji: string;
  characterGradient: string;
  lastMessage: string;
  updatedAt: Date | null;
  createdAt: Date | null;
};

export type ChatMessage = {
  id: string;
  chatId: string;
  role: "user" | "assistant";
  content: string;
  createdAt: Date | null;
  streaming?: boolean;
};
