import type { AuthSessionUser } from "../types";

import axiosInstance from "@/lib/axios";

export const apiLogin = async (body: { phone: string; password: string }) => {
  return await axiosInstance
    .post<{ token: string; user: AuthSessionUser }>("/auth/login", body)
    .then((res) => res.data);
};

export const apiEmulateLogin = async (body: { id: string; hash: string }) => {
  return await axiosInstance
    .post<{ token: string; user: AuthSessionUser }>("/auth/emulate", body)
    .then((res) => res.data);
};

export const apiLogout = async () => {
  return await axiosInstance.post<void>("/auth/logout").then((res) => res.data);
};

export const apiGetSessionUser = async () => {
  return await axiosInstance.get<AuthSessionUser>("/user").then((res) => res.data);
};
