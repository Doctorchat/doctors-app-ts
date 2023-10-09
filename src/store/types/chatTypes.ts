import { ConversationMessage } from "@/features/conversations/types";

export interface ChatState {
  conversation: {
    messages: ConversationMessage[];
    amount: number;
    chat_id: number;
    freeFilesAvailable: number;
    has_doc_messages: boolean;
    investigation_id: number;
    isAccepted: boolean;
    isMeet: boolean;
    price: number;
    status: string;
    type: string;
    user_id: number;
  };
}
export interface ChatConvDoctors {
  messages: ContentMessage[];
  doctor_chat_id: number;
}
export interface ChatDocId {
  doctor_chat_id: number;
}
export interface ContentMessage {
  content: string;
  files: any[];
  id: number;
  seen: boolean;
  type: string;
  updated: string;
  user_id: number;
}
export type ChatAction =
  | { type: "ADD_MESSAGE"; payload: ConversationMessage }
  | { type: "ADD_MESSAGES"; payload: any } // Schimbați tipul payload la oricare
  | { type: "RESET_MESSAGES" };

export const initialState: ChatState = {
  conversation: {
    messages: [],
    amount: 0,
    chat_id: 0,
    freeFilesAvailable: 0,
    has_doc_messages: false,
    investigation_id: 0,
    isAccepted: false,
    isMeet: false,
    price: 0,
    status: "",
    type: "",
    user_id: 0,
  },
};
export interface ChatSliceState {
  data: {
    doctor_chat_id: number;
    messages: ContentMessage[];
  };
}
interface Category {
  id: number;
  name_ro: string;
  name_ru: string;
  name_en: string;
}

interface Activity {
  likes: number;
  responseTime: number;
  helpedUsers: number;
  testimonialsCount: number;
  workplace: string;
  education: string[];
}

interface Bio {
  en: string | null;
  ro: string | null;
  ru: string | null;
}

interface Review {
  avatar: string;
  name: string;
  content: string;
  like: boolean;
  created: string;
}

export interface DoctorInfo {
  id: number;
  isOnline: boolean;
  name: string;
  avatar: string;
  isGuard: boolean;
  isAvailable: boolean;
  category: Category[];
  price: number | null;
  meet_price: number | null;
  activity: Activity;
  about: {
    bio: Bio;
    bio_ro: string | null;
    bio_ru: string | null;
    bio_en: string | null;
    experience: number;
    specialization: Bio;
    specialization_ro: string | null;
    specialization_ru: string | null;
    specialization_en: string | null;
    professionalTitle: string;
  };
  disponibility: any;
  vacation: any[]; // Aici ar trebui să specificați tipul corect
  hidden: boolean;
  status: boolean;
  offer_discount: boolean;
  discount: number;
  discount_days: number;
  private: {
    balance: number;
  };
  reviews: Review[];
  locale: string;
  role: number;
  last_seen: string;
  time_frame: number;
  time_buffer: number;
  chat: boolean;
  video: boolean;
  reservations: any; // Aici ar trebui să specificați tipul corect
  avatar_full: string | null;
  email: string;
  "g-auth": boolean;
  individualPackage: boolean;
  individualPackageTypeFree: any; // Aici ar trebui să specificați tipul corect
  consultationAutoRenew: boolean;
}
