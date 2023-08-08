export interface ConversationPreview {
  id: number;
  user_id: number;
  company_id: number;
  avatar: string;
  name: string;
  description: string | null;
  isOnline: boolean;
  isAnonym: boolean;
  type: string;
  unread: number;
  updated: string;
}

export interface ConversationMessageFile {
  id: number;
  name: string;
  file_url: string;
  size: string;
  type: string;
}

export interface ConversationMessage {
  id: number;
  side: "in" | "out" | "center";
  content: string | null;
  files: ConversationMessageFile[];
  created: string;
  updated: string;
}

export interface Conversation {
  chat_id: number;
  user_id: number;
  isAccepted: boolean;
  status: "open" | "closed";
  messages: ConversationMessage[];
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
