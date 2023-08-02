export interface Conversation {
  id: number;
  user_id: number;
  company_id: number;
  avatar: string;
  name: string;
  description: string | null;
  isOnline: boolean;
  type: string;
  unread: number;
  updated: string;
}
