import { SessionUser } from "@/features/auth";
import axiosInstance from "@/lib/axios";

export const getPartners = async () => {
  return await axiosInstance.get("/user/partners").then((res) => res.data);
};
