import axiosInstance from "@/lib/axios";
import { INotifications, INotificationsData } from "../types";

export const apiGetNotificationList = async () => {
  return await axiosInstance.get<INotificationsData>(`/notifications/`).then((res) => res.data);
};

export const apiGetNotificationUnreadable = async () => {
  return await axiosInstance
    .get<INotificationsData>(`/notifications/unread`)
    .then((res) => res.data);
};

export const apiGetNotificationNext = async (current_page: number) => {
  return await axiosInstance
    .get<INotificationsData>(`/notifications/?page=${current_page}`)
    .then((res) => res.data);
};

export const apiGetNotificationReadAll = async (ids: number[]) => {
  return await axiosInstance
    .put<INotificationsData>(`/notifications/read-batch`, { ids: ids })
    .then((res) => res);
};

export const apiGetNotificationRead = async (notification_id: number) => {
  return await axiosInstance
    .put<INotificationsData>(`/notifications/read/${notification_id}`)
    .then((res) => res.data);
};

