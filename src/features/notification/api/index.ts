// /notifications/list

import axiosInstance from "@/lib/axios";

export const apiGetNotificationList = async () => {
  return await axiosInstance.get<any>(`/notifications/list`).then((res) => res.data.notifications);
};
