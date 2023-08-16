import axiosInstance from "@/lib/axios";

export const setUserLocale = async (locale: string) => {
  return await axiosInstance.post("/user/locale", { locale });
};
