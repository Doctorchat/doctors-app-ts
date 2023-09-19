import axiosInstance from "@/lib/axios";
import { StatisticsDashboard } from "../types";

export const apiGetDashboard = async () => {
  return await axiosInstance.get<StatisticsDashboard>("/user/dashboard").then((res) => res.data);
};
