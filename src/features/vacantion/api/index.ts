import axiosInstance from "@/lib/axios";

export const apiSendVacation = async (data: any) => {
  return await axiosInstance.post("/user/card/vacation", data);
};
