import axiosInstance from "@/lib/axios";
import {
  ApiResponseMedicalCentre,
  IMedicalCentreData,
} from "@/features/medical-centre-appointment/types";
import { API_URL } from "@/config";

export const getMedicalCentre = async () => {
  return await axiosInstance
    .get<ApiResponseMedicalCentre>(`/doctor/medical-centers`)
    .then((res) => res.data);
};

export const getMyPhysicalConsultations = async () => {
  return await axiosInstance.get(`/api/my-physical-consultations`, {
    baseURL: API_URL,
  });
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

export const removeSlot = async (physicalSlotId: number) => {
  return await axiosInstance
    .delete(`/doctor/medical-centers/${physicalSlotId}/delete`)
    .then((res) => res.data);
};
