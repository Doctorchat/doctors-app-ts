import { ConversationPreview } from "@/features/conversations/types";

import { initialStateListChats } from "@/redux/types/listChatsTypes";
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

    addListChats: (state, action: PayloadAction<ConversationPreview[]>) => {
      if (!state.data.length) state.data.push(...action.payload);
    },
  },
});

export const { updateListChats, addListChats } = listChatsSlice.actions;
export default listChatsSlice.reducer;
