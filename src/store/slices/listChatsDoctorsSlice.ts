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
    updateListChatsDoctors: (
      state,
      action: PayloadAction<{ chat_id: number; lastMessage: Partial<any> }>
    ) => {
      const { chat_id, lastMessage } = action.payload;
      console.log(lastMessage);
      const index = state.data.findIndex((item) => item.id === chat_id);
      if (index !== -1) {
        state.data[index].lastMessage = lastMessage;
      }
    },
    updateUnReadMessageDoctors: (
      state,
      action: PayloadAction<{ id: number; unreadCount: number }>
    ) => {
      console.log(state);
      const { id, unreadCount } = action.payload;
      const index = state.data.findIndex((item) => item.id === id);
      if (index !== -1) {
        // Actualizează doar variabilele unread și chat_id
        state.data[index].unreadCount = unreadCount;
      }
    },

    addListChatsDoctors: (state, action: PayloadAction<any[]>) => {
      // Șterge conținutul stării curente
      if (!state.data.length) {
        // Adaugă conversațiile primite prin action.payload
        state.data.push(...action.payload);

        // Sortează starea după data actualizării
        state.data = sortChatsByUpdatedAt(state.data);
        console.log(state.data);
      }
    },
  },
});

export const { updateListChatsDoctors, addListChatsDoctors, updateUnReadMessageDoctors } =
  listChatsDoctorsSlice.actions;
export default listChatsDoctorsSlice.reducer;
