import axiosInstance from "@/lib/axios";

export const apiSendVacation = async (data: any) => {
  return await axiosInstance.post("/user/card/vacation", data);
};
export const getVacations = async () => {
  return await axiosInstance.get("user/vacation-logs").then((res) => res.data);
};
export const apiCancelVacation = async () => {
  return await axiosInstance.put("/user/card/vacation");
};
