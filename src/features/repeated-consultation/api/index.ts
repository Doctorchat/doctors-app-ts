import { SessionUser } from "@/features/auth";
import axiosInstance from "@/lib/axios";

export const updateDiscount = async (body: {
  offer_discount: boolean;
  discount_days: number;
  discount: number;
}) => {
  return await axiosInstance
    .post<{ token: string; user: SessionUser }>("/user/update/discount", body)
    .then((res) => res.data);
};
