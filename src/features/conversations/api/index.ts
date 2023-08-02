import type { Conversation } from "../types";

import axiosInstance from "@/lib/axios";

export const getConversationsWithPatients = async () => {
  return await axiosInstance.get<Conversation[]>("/chat/list").then((res) => res.data);
};

export const getConversationsWithDoctors = async () => {};

export const getConversation = async () => {};
