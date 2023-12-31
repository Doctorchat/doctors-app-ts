import axiosInstance from "@/lib/axios";
import { SetDisponibilityPayload } from "../types";

export const getSlots = async (doctorId: number) => {
  return await axiosInstance.get(`/doctors/slots/${doctorId}`).then((res) => res.data);
};

export const removeSlot = async (slotId: number) => {
  return await axiosInstance.delete(`/user/card/reservations/${slotId}`).then((res) => res.data);
};

export const getMeetings = async () => {
  return await axiosInstance.get("/user/card/reservations/pending").then((res) => res.data);
};

export const getFinishedMeetings = async () => {
  return await axiosInstance.get("/user/card/reservations/finished").then((res) => res.data);
};

export const setDisponibility = async (data: SetDisponibilityPayload) => {
  return await axiosInstance.post(`/user/card/disponibility`, data).then((res) => res.data);
};

export const authGoogleVerify = async (data: any) => {
  return await axiosInstance({
    baseURL: "https://api.doctorchat.md/api",
    url: "/authorize/verify",
    method: "POST",
    data,
  }).then((res) => res.data);
};

export const authGoogleCancel = async () => {
  return await axiosInstance({
    baseURL: "https://api.doctorchat.md/api",
    url: "/authorize/cancel",
    method: "POST",
  }).then((res) => res.data);
};
