import { Conversation, ConversationMessage } from "@/features/conversations/types";
import { initialState } from "@/store/types/chatTypes";
import { getCurrentDateTime } from "@/utils/calculate-edit-message";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const chatContentSlice = createSlice({
  name: "chatContent",
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<ConversationMessage>) => {
      const newMessage = action.payload;
      const existingMessageIds = new Set(state.conversation.messages.map((message) => message.id));
      if (!existingMessageIds.has(newMessage.id)) {
        state.conversation.messages.push(newMessage);
      }
    },
    updateMessage: (state, action: PayloadAction<{ id: number; content: string }>) => {
      const { id, content } = action.payload;
      const messageIndex = state.conversation.messages.findIndex((message) => message.id === id);
      if (messageIndex !== -1) {
        // Creăm un nou obiect mesaj pentru a actualiza conținutul
        state.conversation.messages[messageIndex] = {
          ...state.conversation.messages[messageIndex],
          content: content,
          updated: getCurrentDateTime(),
        };
      }
    },
    addMessages: (
      state,
      action: PayloadAction<{
        conversation: Partial<Conversation>;
        messages: ConversationMessage[];
      }>
    ) => {
      state.conversation = { ...state.conversation, ...action.payload.conversation };
      state.conversation.messages = action.payload.messages;
    },
    resetMessages: (state) => {
      state.conversation.messages = [];
    },
  },
});

export const { addMessage, addMessages, updateMessage, resetMessages } = chatContentSlice.actions;
export default chatContentSlice.reducer;
