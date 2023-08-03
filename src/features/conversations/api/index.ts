import type { Conversation, ConversationPreview, UserCard } from "../types";

import axiosInstance from "@/lib/axios";

export const apiGetConversationsWithPatients = async () => {
  return await axiosInstance.get<ConversationPreview[]>("/chat/list").then((res) => res.data);
};

export const apiGetConversationsWithDoctors = async () => {};

export const apiGetConversation = async (id: string) => {
  return await axiosInstance.get<Conversation>(`/chat/get/${id}`).then((res) => res.data);
};

export const apiGetUserCard = async (id: number, anonym: boolean) => {
  return await axiosInstance
    .get<UserCard>(`/user/card/${id}?is_anonym=${anonym}`)
    .then((res) => res.data);
};
