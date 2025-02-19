import { useQuery } from "react-query";
import { getMedicalCentre } from "@/features/medical-centre-appointment/api";
import { ApiResponseMedicalCentre } from "@/features/medical-centre-appointment/types";

export const useMedicalCentreList = () => {
  const {
    data,
    refetch: refetchMedicalCentre,
    isLoading: isLoadingMedicalCentre,
  } = useQuery<ApiResponseMedicalCentre>({
    queryKey: ["medical-centre-list"],
    queryFn: async () => {
      return getMedicalCentre();
    },
  });

  return { medicalCentreList: data?.data, refetchMedicalCentre, isLoadingMedicalCentre };
};
