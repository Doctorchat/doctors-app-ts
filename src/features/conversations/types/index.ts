export interface ConversationPreview {
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

export interface Conversation {
  id: number;
  user_id: number;
}

export interface UserCardInvestigation {
  activity: string;
  age: number;
  birth_date: string;
  bmi: number;
  created_at: string;
  diseases_spec: string;
  height: number;
  id: number;
  location: string;
  name: string;
  sex: string;
  updated_at: string;
  user_id: number;
  weight: number;
}

export interface UserCard {
  id: number;
  avatar: string;
  name: string;
  last_seen: string;
  isOnline: boolean;
  investigations: UserCardInvestigation[];
}
