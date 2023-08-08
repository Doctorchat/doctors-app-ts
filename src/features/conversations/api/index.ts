import type { Conversation, ConversationPreview, UserCard } from "../types";

import axiosInstance from "@/lib/axios";

export const apiGetConversationsWithPatients = async () => {
  return await axiosInstance.get<ConversationPreview[]>("/chat/list").then((res) => res.data);
};

export const apiGetConversationsWithDoctors = async () => {};

export const apiGetConversation = async (id: string) => {
  return await axiosInstance.get<Conversation>(`/chat/get/${id}`).then((res) => res.data);
};

export const apiGetUserCard = async (id: number, anonymous: boolean) => {
  return await axiosInstance
    .get<UserCard>(`/user/card/${id}?is_anonym=${anonymous}`)
    .then((res) => res.data);
};

export const apiAcceptConversation = async (id: number) => {
  return await axiosInstance.post("/chat/accept", {
    chat_id: id,
  });
};

export const apiRejectConversation = async (id: number, message: string) => {
  return await axiosInstance.post("/chat/refuse", {
    chat_id: id,
    message,
  });
};
