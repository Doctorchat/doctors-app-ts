import axiosInstance from "@/lib/axios";

export const apiRestore = async (data:any) => {
  return await axiosInstance
    .post("/auth/forgot-password", data)
    .then((res) => res.data);
};
