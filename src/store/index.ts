import { configureStore } from "@reduxjs/toolkit";

import * as slices from "./slices";

export const store = configureStore({
  reducer: {
    chatContent: slices.chatContentSlice,
  },
});
