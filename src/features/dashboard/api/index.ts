import axiosInstance from "@/lib/axios";
import { IReservations, IReservationsCalendar, StatisticsDashboard } from "../types";

export const apiGetDashboard = async () => {
  return await axiosInstance.get<StatisticsDashboard>("/user/dashboard").then((res) => res.data);
};
export const apiGetReservations = async (month: string) => {
  return await axiosInstance
    .get<IReservationsCalendar>(`/user/dashboard/reservations?month=${month}`)
    .then((res) => res.data);
};
