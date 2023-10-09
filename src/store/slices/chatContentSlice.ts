import { Conversation, ConversationMessage } from "@/features/conversations/types";
import { ChatState, initialState } from "@/store/types/chatTypes";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const chatContentSlice = createSlice({
  name: "chatContent",
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<ConversationMessage>) => {
      state.conversation.messages.push(action.payload);
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

export const { addMessage, addMessages, resetMessages } = chatContentSlice.actions;
export default chatContentSlice.reducer;
