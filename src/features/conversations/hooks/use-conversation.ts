import React from "react";
import { useSearchParams } from "react-router-dom";

import { useQuery } from "react-query";

import { apiGetConversation, apiGetConversationDoctors, apiGetUserCard } from "../api";

export const useConversation = () => {
  const [searchParams] = useSearchParams();
  const [patientId, setPatientId] = React.useState<string | null>(null);
  const [doctorId, setDoctorId] = React.useState<string | null>(null);
  console.log(doctorId);
  const {
    data: conversation,
    isLoading: isConversationLoading,
    isError: isConversationErrored,
  } = useQuery({
    queryKey: ["conversation", patientId ?? doctorId],
    queryFn: async () => {
      if (patientId) {
        return apiGetConversation(patientId);
      } else if (doctorId) {
        return apiGetConversationDoctors(doctorId);
      }
    },
    enabled: Boolean(patientId) || Boolean(doctorId),
  });

  const {
    data: card,
    isLoading: isCardLoading,
    isError: isCardErrored,
  } = useQuery({
    queryKey: ["user-card", conversation?.user_id],
    queryFn: async () => {
      if (conversation?.user_id)
        return apiGetUserCard(conversation.user_id, searchParams.get("anonymous") === "true");
    },
    enabled: Boolean(conversation?.user_id),
  });

  React.useEffect(() => {
    if (searchParams.has("patientId")) {
      setPatientId(searchParams.get("patientId") ?? null);
      setDoctorId(null);
    } else if (searchParams.has("doctorId")) {
      setDoctorId(searchParams.get("doctorId") ?? null);
      setPatientId(null);
    } else {
      setPatientId(null);
      setDoctorId(null);
    }
  }, [searchParams]);

  return React.useMemo(
    () => ({
      patientId,
      doctorId,
      conversation,
      isConversationLoading,
      isConversationErrored,
      card,
      isCardLoading,
      isCardErrored,
    }),
    [
      card,
      patientId,
      doctorId,
      conversation,
      isCardErrored,
      isCardLoading,
      isConversationErrored,
      isConversationLoading,
    ]
  );
};
