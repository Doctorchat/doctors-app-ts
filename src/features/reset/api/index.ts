import axiosInstance from "@/lib/axios";

export const apiCheckCode = async (data:any) => {
  return await axiosInstance.post("/auth/validate", data).then((res) => res.data);
};

export const apiRestorePassword = async (data: any) => {
  return await axiosInstance.post("/auth/reset-password", data).then((res) => res.data);
};
