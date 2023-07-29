import type { SessionUser } from "../types";

import axiosInstance from "@/lib/axios";

export const apiLogin = async (body: { phone: string; password: string }) => {
  return await axiosInstance.post<{ token: string; user: SessionUser }>("/auth/login", body);
};

export const apiLogout = async () => {
  return await axiosInstance.post<void>("/auth/logout");
};

export const apiGetSessionUser = async () => {
  return await axiosInstance.get<SessionUser>("/user");
};
