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
      action: PayloadAction<{
        chat_id: number;
        unreadCount: number;
        updated_at: string;
        lastMessage: Partial<any>;
      }>
    ) => {
      const { chat_id, lastMessage, unreadCount, updated_at } = action.payload;
      const index = state.data.findIndex((item) => item.id === chat_id);
      if (index !== -1) {
        state.data[index].unreadCount = unreadCount;
        state.data[index].updated_at = updated_at;
        state.data[index].lastMessage = lastMessage;
        state.data = sortChatsByUpdatedAt(state.data);
      }
    },

    updateUnReadMessageDoctors: (
      state,
      action: PayloadAction<{ id: number; unreadCount: number }>
    ) => {
      const { id, unreadCount } = action.payload;
      const index = state.data.findIndex((item) => item.id === id);
      if (index !== -1) {
        // Actualizează doar variabilele unread și chat_id
        state.data[index].unreadCount = unreadCount;
      }
    },

    addListChatsDoctors: (state, action: PayloadAction<any[]>) => {
      // Schimbă variabila state.data cu datele primite prin action.payload
      state.data = action.payload;
      // Sortează starea după data actualizării
      state.data = sortChatsByUpdatedAt(state.data);
    },
  },
});

export const { updateListChatsDoctors, addListChatsDoctors, updateUnReadMessageDoctors } =
  listChatsDoctorsSlice.actions;
export default listChatsDoctorsSlice.reducer;
