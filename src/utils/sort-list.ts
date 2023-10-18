import { ConversationDoctors, ConversationPreview } from "@/features/conversations/types";
import { IChatCloseOrOpen } from "@/features/dashboard/types";

export const sortChatsByUpdatedAt = (chats: ConversationPreview[]): ConversationPreview[] => {
  return chats.slice().sort((a, b) => {
    const dateA = new Date(a.updated ?? a.updated_at);
    const dateB = new Date(b.updated ?? b.updated_at);

    return dateB.getTime() - dateA.getTime();
  });
};

export const sortChatsByUpdatedOpen = (chats: IChatCloseOrOpen[]): IChatCloseOrOpen[] => {
  return chats.slice().sort((a, b) => {
    const dateA = new Date(a.updated);
    const dateB = new Date(b.updated);

    return dateB.getTime() - dateA.getTime();
  });
};
export const sortChatsByUpdatedDoctor = (chats: ConversationDoctors[]): ConversationDoctors[] => {
  return chats.slice().sort((a, b) => {
    const dateA = new Date(a.updated_at);
    const dateB = new Date(b.updated_at);

    return dateB.getTime() - dateA.getTime();
  });
};
