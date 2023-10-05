import React, { createContext, useContext, useReducer } from "react";
import { ConversationMessage } from "../types";

import { Provider } from "react-redux";

interface ChatState {
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

type ChatAction =
  | { type: "ADD_MESSAGE"; payload: ConversationMessage }
  | { type: "ADD_MESSAGES"; payload: any } // Schimbați tipul payload la oricare
  | { type: "RESET_MESSAGES" };

const initialState: ChatState = {
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

const ChatContext = createContext<
  | {
      state: ChatState;
      dispatch: React.Dispatch<ChatAction>;
    }
  | undefined
>(undefined);

const chatReducer = (state: ChatState, action: ChatAction): ChatState => {
  switch (action.type) {
    case "ADD_MESSAGE":
      return {
        ...state,
        conversation: {
          ...state.conversation,
          messages: [...state.conversation.messages, action.payload],
        },
      };
    case "ADD_MESSAGES":
      return {
        ...state,
        conversation: {
          ...state.conversation,
          ...action.payload,
          messages: [...state.conversation.messages, ...action.payload.messages], // Adăugăm mesajele noi
        },
      };
    case "RESET_MESSAGES":
      return { ...state, conversation: { ...state.conversation, messages: [] } };
    default:
      return state;
  }
};

interface ChatProviderProps {
  children: React.ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  // Utilizați Provider din react-redux pentru a furniza starea și dispatcher-ul
  return <ChatContext.Provider value={{ state, dispatch }}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
