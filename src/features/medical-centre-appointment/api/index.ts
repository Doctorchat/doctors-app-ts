import axiosInstance from "@/lib/axios";
import {
  ApiResponseMedicalCentre,
  IMedicalCentreData,
  SetDisponibilityPayload,
} from "@/features/medical-centre-appointment/types";

export const getMedicalCentre = async () => {
  return await axiosInstance
    .get<ApiResponseMedicalCentre>(`/doctor/medical-centers`)
    .then((res) => res.data);
};

export const updateDisponibilityByMedicalCentreId = async ({
  id,
  ...data
}: Omit<IMedicalCentreData, "medical_centre">) => {
  return await axiosInstance.put(`/doctor/medical-centers/${id}`, data).then((res) => res.data);
};

export const getSlots = async (medicalCentreId: string) => {
  return await axiosInstance
    .get(`/doctor/medical-centers/slots`, { params: { medical_centre_id: medicalCentreId } })
    .then((res) => res.data);
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

export const setDisponibility = async (data: SetDisponibilityPayload) => {
  return await axiosInstance.post(`/user/card/disponibility`, data).then((res) => res.data);
};
