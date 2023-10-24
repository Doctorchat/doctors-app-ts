import { configureStore } from "@reduxjs/toolkit";

import * as slices from "./slices";

export const store = configureStore({
  reducer: {
    chatContent: slices.chatContentSlice,
    listChats: slices.listChatsSlice,
    chatContentDoctors: slices.chatContentDoctorsSlice,
    listChatsDoctors: slices.listChatsDoctorsSlice,
    doctorInfo: slices.doctorInfoSlice,
    listsChatsShorts: slices.listsChatsShortsSlice,
  },
});
