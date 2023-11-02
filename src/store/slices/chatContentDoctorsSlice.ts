import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ChatConvDoctors, ChatSliceState, ContentMessage } from "../types/chatTypes";

const initialState: ChatSliceState = {
  data: {
    doctor_chat_id: 0,
    messages: [],
  },
};

const chatContentDoctorsSlice = createSlice({
  name: "chatContentDoctors",
  initialState,
  reducers: {
    addMessageDoctors: (state, action: PayloadAction<ContentMessage>) => {
      const newMessage = action.payload;
      const existingMessageIds = new Set(state.data.messages.map((message) => message.id));
      if (!existingMessageIds.has(newMessage.id)) {
        state.data.messages.push(newMessage);
      }
    },
    addMessagesDoctors: (
      state,
      action: PayloadAction<{
        doctor_chat_id: number;
        messages: ContentMessage[];
      }>
    ) => {
      state.data.doctor_chat_id = action.payload.doctor_chat_id; // Asignați direct numărul
      state.data.messages = action.payload.messages;
    },
    resetMessagesDoc: (state) => {
      //   state.conversation.messages = [];
    },
  },
});

export const { addMessageDoctors, addMessagesDoctors, resetMessagesDoc } =
  chatContentDoctorsSlice.actions;
export default chatContentDoctorsSlice.reducer;
