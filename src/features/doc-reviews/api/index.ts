import axiosInstance from "@/lib/axios";

export const getMyReviews = async () => {
  return await axiosInstance.get(`/reviews/my`).then((res) => res.data);
};
