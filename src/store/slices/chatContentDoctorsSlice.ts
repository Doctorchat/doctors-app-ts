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
      state.data.messages.push(action.payload);
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
