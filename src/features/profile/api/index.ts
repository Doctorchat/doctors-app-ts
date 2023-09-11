import axiosInstance from "@/lib/axios";
import { PasswordTypes } from "../types";

export const updateDoctor = async (data: {}) => {
  return await axiosInstance.post("/user/update-doctor", data).then((res) => res.data);
};

export const updateAvatar = async (file: File) => {
  return await axiosInstance.post("/user/update-avatar", file).then((res) => res.data);
};

export const toggleChatConversations = async () => {
  return await axiosInstance.put("/user/card/toggle-chat").then(res => Promise.resolve(res.data));
};

export const toggleVideoChatConversations = async () => {
  return await axiosInstance.put("/user/card/toggle-video").then(res => Promise.resolve(res.data));
};

export const updatePassword = async (data: PasswordTypes) => {
  return await axiosInstance.post("/user/change-password/", data);
};

export const getSpecialitites = async () => {
  return await axiosInstance.get("/specialities");
};

export const getUser = async () => {
  return await axiosInstance.get("/user");
};