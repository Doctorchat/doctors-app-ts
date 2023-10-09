export interface ConversationPreview {
  updated_at?: string;
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
  title?: string;
  lastMessage?: {
    content?: string;
  };
  unreadCount?: number;
}

export interface ConversationDoctors {
  created_at: string;
  id: number;
  lastMessage: LastMessageDc[];
  messages: LastMessageDc[];
  participants: ParticipantsList[];
  title: string;
  unreadCount: number;
  updated_at: string;
}
export interface LastMessageDc {
  content: string;
  created_at: string;
  doctor_chat_id: number;
  id: number;
  seen: number;
  type: string;
  updated_at: string;
  user_id: 1;
}
export interface ParticipantsList {
  created_at: string;
  doctor_chat_id: number;
  id: number;
  updated_at: string;
  user: any;
  user_id: 1;
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
  side?: "in" | "out" | "center";
  content: string | null;
  files: ConversationMessageFile[];
  created: string;
  recommendations: RecomandationsAnalyzes[];
  updated?: string;
}

export interface Conversation {
  chat_id: number;
  user_id: number;
  isAccepted: boolean;
  status: "open" | "closed";
  messages: ConversationMessage[];
  doctor_chat_id?: number;
}
export interface RecomandationsAnalyzes {
  name: string;
  synevo_id: string;
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

export interface Category {
  id: number;
  synevo_id: string;
  name: string;
  tests: Test[];
}

export interface Test {
  id: number;
  synevo_id: string;
  name: string;
}

export interface Recomandation {
  favorite: Category[];
  categories: Category[];
}

export interface RequestFileStore {
  open: boolean;
  setOpen: (open: boolean) => void;
}
export interface TreeNodeData {
  title: string;
  value: string;
  children?: TreeNodeData[];
  checkable?: boolean;
  key?: any;
}
