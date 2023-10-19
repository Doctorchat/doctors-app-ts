import type { SessionUser } from "../types";

import axiosInstance from "@/lib/axios";

export const apiLogin = async (body: {
  language: string; phone: string; password: string 
}, language: string) => {
  body.language = language;
  return await axiosInstance
    .post<{ token: string; user: SessionUser }>("/auth/doctor-login", body)
    .then((res) => res.data);
};

export const apiEmulateLogin = async (body: { id: string; hash: string }) => {
  return await axiosInstance
    .post<{ token: string; user: SessionUser }>("/auth/emulate", body)
    .then((res) => res.data);
};

export const apiLogout = async () => {
  return await axiosInstance.post<void>("/auth/logout").then((res) => res.data);
};

export const apiGetSessionUser = async () => {
  return await axiosInstance.get<SessionUser>("/user").then((res) => res.data);
};
