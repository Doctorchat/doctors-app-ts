import { ConversationPreview } from "@/features/conversations/types";
import { sortChatsByUpdatedAt } from "@/utils/sort-list";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
const initialState = {
  listDoctors: [] as ConversationPreview[],
  listPatients: [] as ConversationPreview[],
  listClosed: [] as ConversationPreview[],
};
const listsChatsShortsSlice = createSlice({
  name: "listsChatsShorts",
  initialState,
  reducers: {
    updateDoctorUnread: (state, action: PayloadAction<{ id: number; unreadCount: number }>) => {
      const { id, unreadCount } = action.payload;
      const doctorIndex = state.listDoctors.findIndex((item) => item.id === id);
      if (doctorIndex !== -1) {
        state.listDoctors[doctorIndex].unreadCount = unreadCount;
      }
    },

    updatePatientUnreadCount: (state, action: PayloadAction<{ id: number; unread: number }>) => {
      const { id, unread } = action.payload;
      const patientIndex = state.listPatients.findIndex((item) => item.id === id);
      if (patientIndex !== -1) {
        state.listPatients[patientIndex].unread = unread;
      }
    },

    addDoctors: (state, action: PayloadAction<ConversationPreview[]>) => {
      state.listDoctors = action.payload;
    },

    addPatients: (state, action: PayloadAction<ConversationPreview[]>) => {
      state.listPatients = action.payload;
    },
    addClosed: (state, action: PayloadAction<ConversationPreview[]>) => {
      state.listClosed = action.payload;
    },
  },
});

export const { addDoctors, addPatients, addClosed, updateDoctorUnread, updatePatientUnreadCount } =
  listsChatsShortsSlice.actions;
export default listsChatsShortsSlice.reducer;
