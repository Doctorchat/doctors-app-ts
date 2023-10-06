import { ConversationPreview } from "@/features/conversations/types";

export const initialStateListChats: ConversationPreview = {
  id: 0,
  user_id: 0,
  company_id: 0,
  avatar: "",
  name: "",
  description: "",
  isOnline: false,
  isAnonym: false,
  type: "",
  unread: 0,
  updated: "",
};
