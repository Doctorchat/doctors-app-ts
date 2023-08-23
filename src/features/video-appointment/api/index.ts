import axiosInstance from "@/lib/axios";

export const getSlots = async (doctorId: number) => {
  return await axiosInstance.get(`/doctors/slots/${doctorId}`).then((res) => res.data);
};

export const removeSlot = async (slotId: number) => {
  return await axiosInstance.delete(`/user/card/reservations/${slotId}`).then((res) => res.data);
};

export const getMeetings = async () => {
  return await axiosInstance.get("/user/card/reservations/pending").then((res) => res.data);
};

export const getFinishedMeetings = async () => {
  return await axiosInstance.get("/user/card/reservations/finished").then((res) => res.data);
};
