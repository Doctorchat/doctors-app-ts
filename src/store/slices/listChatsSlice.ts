import { ConversationPreview } from "@/features/conversations/types";

import { initialStateListChats } from "@/store/types/listChatsTypes";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
const initialState = {
  data: [] as ConversationPreview[],
  isLoading: false,
  isError: false,
  isLoaded: false,
};
const listChatsSlice = createSlice({
  name: "listChats",
  initialState,
  reducers: {
    updateListChats: (
      state,
      action: PayloadAction<{ id: number; updatedData: Partial<ConversationPreview> }>
    ) => {
      const { id, updatedData } = action.payload;
      console.log(action.payload);
      const index = state.data.findIndex((item) => item.id === id);

      if (index !== -1) {
        state.data[index] = { ...state.data[index], ...updatedData };
      }
    },
    updateUnReadMessage: (state, action: PayloadAction<{ id: number; unread: number }>) => {
      const { id, unread } = action.payload;
      const index = state.data.findIndex((item) => item.id === id);

      if (index !== -1) {
        // Actualizează doar variabilele unread și chat_id
        state.data[index].unread = unread;
      }
    },

    addListChats: (state, action: PayloadAction<ConversationPreview[]>) => {
      if (!state.data.length) state.data.push(...action.payload);
    },
  },
});

export const { updateListChats, addListChats, updateUnReadMessage } = listChatsSlice.actions;
export default listChatsSlice.reducer;
