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
    updatePatientChatList: (
      state,
      action: PayloadAction<{ id: number; updatedData: Partial<ConversationPreview> }>
    ) => {
      const { id, updatedData } = action.payload;
      const patientIndex = state.listPatients.findIndex((item) => item.id === id);
      if (patientIndex !== -1) {
        state.listPatients[patientIndex] = {
          ...state.listPatients[patientIndex],
          ...updatedData,
        };
        state.listPatients = sortChatsByUpdatedAt(state.listPatients);
      } else {
        const newPatient: ConversationPreview = {
          ...(updatedData as ConversationPreview),
        };
        state.listPatients.push(newPatient);
        state.listPatients = sortChatsByUpdatedAt(state.listPatients);
      }
    },

    updateDoctorChatList: (
      state,
      action: PayloadAction<{
        chat_id: number;
        lastMessage: Partial<ConversationPreview["lastMessage"]>;
        unreadCount: number;
        updated_at: string;
        title: string;
      }>
    ) => {
      const { chat_id, lastMessage, unreadCount, updated_at, title } = action.payload;
      const doctorIndex = state.listDoctors.findIndex((item) => item.id === chat_id);

      if (doctorIndex !== -1) {
        state.listDoctors[doctorIndex] = {
          ...state.listDoctors[doctorIndex],
          lastMessage,
          unreadCount,
          updated_at,
          id: chat_id,
          title: title,
        };
        state.listDoctors = sortChatsByUpdatedAt(state.listDoctors);
      } else {
        const newDoctor: any = {
          id: chat_id,
          lastMessage,
          unreadCount,
          updated_at,
          title: title,
        };
        state.listDoctors.push(newDoctor);
        state.listDoctors = sortChatsByUpdatedAt(state.listDoctors);
      }
    },
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
      state.listDoctors = sortChatsByUpdatedAt(state.listDoctors);
    },
    addPatients: (state, action: PayloadAction<ConversationPreview[]>) => {
      state.listPatients = action.payload;
      state.listPatients = sortChatsByUpdatedAt(state.listPatients);
    },
    addClosed: (state, action: PayloadAction<ConversationPreview[]>) => {
      state.listClosed = action.payload;
    },
  },
});

export const {
  addDoctors,
  addPatients,
  addClosed,
  updateDoctorUnread,
  updatePatientUnreadCount,
  updatePatientChatList,
  updateDoctorChatList,
} = listsChatsShortsSlice.actions;
export default listsChatsShortsSlice.reducer;
