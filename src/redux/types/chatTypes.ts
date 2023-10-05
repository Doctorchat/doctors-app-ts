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
    // ... alte proprietăți ale conversation
  },
};
