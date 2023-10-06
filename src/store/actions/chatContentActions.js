import { CHAT_CONTENT_READ } from "@/context/APIKEY";
import { apiReadMessages } from "@/features/conversations/api";
import { createAsyncThunk } from "@reduxjs/toolkit";

// Definirea thunk-ului asincron
export const readChatMessages = createAsyncThunk(CHAT_CONTENT_READ, async ({ id, messages }) => {
  const res = await apiReadMessages({ id, messages });
  return res.data;
});
