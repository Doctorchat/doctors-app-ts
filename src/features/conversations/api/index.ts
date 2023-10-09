import type { Conversation, ConversationPreview, Recomandation, UserCard } from "../types";

import axiosInstance from "@/lib/axios";

export const apiGetConversationsWithPatients = async () => {
  return await axiosInstance.get<ConversationPreview[]>("/chat/list").then((res) => res.data);
};

export const apiGetConversationsWithDoctors = async (id: number) => {
  return await axiosInstance.get<any[]>(`doctor/chat-list?doctor_id=${id}`).then((res) => res.data);
};
export const apiGetConversation = async (id: string) => {
  return await axiosInstance.get<Conversation>(`/chat/get/${id}`).then((res) => res.data);
};
export const apiGetConversationDoctors = async (chatId: string) => {
  return await axiosInstance
    .get<Conversation>(`/doctor/get-chat/${chatId}`)
    .then((res) => res.data);
};

export const apiGetUserCard = async (id: number, anonymous: boolean) => {
  return await axiosInstance
    .get<UserCard>(`/user/card/${id}?is_anonym=${anonymous}`)
    .then((res) => res.data);
};

export const apiGetDoctorChatCard = async (doctor_chat_id: number) => {
  return await axiosInstance
    .get<any>(`/doctor/chat-info/${doctor_chat_id}`)
    .then((res) => res.data);
};

export const apiAcceptConversation = async (id: string) => {
  return await axiosInstance.post("/chat/accept", {
    chat_id: id,
  });
};

export const apiRejectConversation = async (id: string, message: string) => {
  return await axiosInstance.post("/chat/refuse", {
    chat_id: id,
    message,
  });
};

export const apiSendMessage = async (data: { chat_id: number; content: string }) => {
  return await axiosInstance.post("/chat/send", {
    ...data,
    type: "standard",
  });
};

export const apiSendMessageDoctors = async (data: any) => {
  return await axiosInstance.post("/doctor/send-message", data);
};

export const apiSendFile = async (data: { chat_id: number; file: File }) => {
  const formData = new FormData();

  formData.append("uploads[]", data.file);
  formData.append("chat_id", data.chat_id.toString());

  return await axiosInstance.post("/chat/upload", formData);
};

export const apiRequestFile = async (data: { chat_id: number; content: string }) => {
  return await axiosInstance.post(`/chat/request-media/${data.chat_id}`, { content: data.content });
};
export const apiReceiveDoctorsList = async (doctor_id: number) => {
  return await axiosInstance
    .get(`/doctor/doctors-list?doctor_id=${doctor_id}`)
    .then((res) => res.data);
};

export const apiCreateNewChat = async (data: { title: string; doctorIds: number[] }) => {
  return await axiosInstance.post(`/doctor/new`, {
    title: data.title,
    doctorIds: data.doctorIds,
  });
};

export const apiGetRecomandations = async () => {
  return await axiosInstance.get<Recomandation>("/analyzes").then((res) => res.data);
};
export const apiPutRecomandations = async (data: {
  chat_id: string | number | null;
  analyzes: number[];
}) => {
  return await axiosInstance.put<any>("/analyzes/recommend", data).then((res) => res.data);
};
export const apiReadMessages = async (data: { id: number; messages: number[] }) => {
  return await axiosInstance.post(`/chat/read`, { id: data.id, messages: data.messages });
};
