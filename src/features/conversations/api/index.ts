import type { Conversation } from "../types";

import axiosInstance from "@/lib/axios";

export const apiGetConversationsWithPatients = async () => {
  return await axiosInstance.get<Conversation[]>("/chat/list").then((res) => res.data);
};

export const apiGetConversationsWithDoctors = async () => {};

export const apiGetConversation = async () => {};
