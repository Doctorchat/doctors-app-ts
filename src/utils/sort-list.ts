import { ConversationDoctors, ConversationPreview } from "@/features/conversations/types";
import { IChatCloseOrOpen } from "@/features/dashboard/types";

export const sortChatsByUpdatedAt = (chats: ConversationPreview[]): ConversationPreview[] => {
  const supportChat = chats.find((chat) => chat.type === "support");
  if (supportChat) {
    chats = chats.filter((chat) => chat !== supportChat);
  }
  const unreadChats = chats.filter(
    (chat) => chat.unread > 0 || (chat.unreadCount && chat.unreadCount > 0)
  );
  const readChats = chats.filter((chat) => !unreadChats.includes(chat));

  readChats.sort((a, b) => {
    const dateA = new Date(a.updated ?? a.updated_at);
    const dateB = new Date(b.updated ?? b.updated_at);

    return dateB.getTime() - dateA.getTime();
  });

  unreadChats.sort((a, b) => {
    const dateA = new Date(a.updated ?? a.updated_at);
    const dateB = new Date(b.updated ?? b.updated_at);

    return dateB.getTime() - dateA.getTime();
  });

  const sortedChats = supportChat
    ? [supportChat, ...unreadChats, ...readChats]
    : [...unreadChats, ...readChats];

  return sortedChats;
};

export const sortChatsByUpdatedOpen = (
  chats: IChatCloseOrOpen[] | ConversationPreview[]
): IChatCloseOrOpen[] | ConversationPreview[] => {
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
