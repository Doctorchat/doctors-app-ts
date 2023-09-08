import axiosInstance from "@/lib/axios";

export const apiUpdateFCMToken = async (token: string) => {
  return await axiosInstance.patch<any>("/fcm-token", { token }).then((res) => res.data);
};
