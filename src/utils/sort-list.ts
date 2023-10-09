import { ConversationPreview } from "@/features/conversations/types";

export const sortChatsByUpdatedAt = (chats: ConversationPreview[]): ConversationPreview[] => {
  return chats.slice().sort((a, b) => {
    const dateA = new Date(a.updated ?? a.updated_at);
    const dateB = new Date(b.updated ?? b.updated_at);

    return dateB.getTime() - dateA.getTime();
  });
};
