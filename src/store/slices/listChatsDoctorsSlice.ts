import { ConversationPreview } from "@/features/conversations/types";

import { initialStateListChats } from "@/store/types/listChatsTypes";
import { sortChatsByUpdatedAt } from "@/utils/sort-list";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
//TODO tipizarea
const initialState = {
  data: [] as any[],
  isLoading: false,
  isError: false,
  isLoaded: false,
};
const listChatsDoctorsSlice = createSlice({
  name: "listChatsDoctors",
  initialState,
  reducers: {
    updateListChatsDoc: (
      state,
      action: PayloadAction<{ id: number; updatedData: Partial<any> }>
    ) => {
      //   const { id, updatedData } = action.payload;
      //   console.log(action.payload);
      //   const index = state.data.findIndex((item) => item.id === id);
      //   if (index !== -1) {
      //     state.data[index] = { ...state.data[index], ...updatedData };
      //   }
    },
    updateUnReadMessageDoc: (state, action: PayloadAction<{ id: number; unread: number }>) => {
      //   const { id, unread } = action.payload;
      //   const index = state.data.findIndex((item) => item.id === id);
      //   if (index !== -1) {
      //     // Actualizează doar variabilele unread și chat_id
      //     state.data[index].unread = unread;
      //   }
    },

    addListChatsDoctors: (state, action: PayloadAction<any[]>) => {
      if (state.data.length === 0) {
        state.data = action.payload;
        state.data = sortChatsByUpdatedAt(state.data);
        console.log(sortChatsByUpdatedAt(state.data));
      }
    },
  },
});

export const { updateListChatsDoc, addListChatsDoctors, updateUnReadMessageDoc } =
  listChatsDoctorsSlice.actions;
export default listChatsDoctorsSlice.reducer;
