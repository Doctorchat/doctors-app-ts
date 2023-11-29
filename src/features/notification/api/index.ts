import axiosInstance from "@/lib/axios";
import { INotificationsData } from "../types";

export const apiGetNotificationList = async () => {
  return await axiosInstance.get<INotificationsData>(`/notifications/`).then((res) => res.data);
};

export const apiGetNotificationNext = async (current_page: number) => {
  return await axiosInstance
    .get<INotificationsData>(`/notifications/?page=${current_page}`)
    .then((res) => res.data);
};
