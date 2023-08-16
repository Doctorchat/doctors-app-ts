import axiosInstance from "@/lib/axios";
// import { Wallet } from "@/types";

export const getWallet = async () => {
  return await axiosInstance.get("/user/wallet").then((res) => res.data);
};

// DODO: Review if need change in user folder
export const getUserTransactions = async () => {
  return await axiosInstance.get("/user/transactions").then((res) => res.data);
};
