import React from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "react-query";

import {
  apiGetConversation,
  apiGetConversationDoctors,
  apiGetDoctorChatCard,
  apiGetUserCard,
} from "../api";
import { useDispatch } from "react-redux";

import { addMessages } from "@/store/slices/chatContentSlice";
import { Conversation } from "../types";
import { addMessagesDoctors } from "@/store/slices/chatContentDoctorsSlice";
import { useMediaQuery } from "usehooks-ts";

export const useConversation = () => {
  const [searchParams] = useSearchParams();
  const [patientId, setPatientId] = React.useState<string | null>(null);
  const [doctorId, setDoctorId] = React.useState<string | null>(null);
  const isMobile = useMediaQuery("(max-width: 1024px)");
  const dispatch = useDispatch();
  const {
    data: conversationPatients,
    isLoading: isConversationLoading,
    isError: isConversationErrored,
  } = useQuery({
    queryKey: ["conversation-patient", patientId],
    queryFn: async () => {
      if (patientId) return apiGetConversation(patientId);
    },
    enabled: Boolean(patientId),
    staleTime: 0,
    onSuccess: (data: Conversation) => {
      if (data)
        return dispatch(
          addMessages({
            conversation: data,
            messages: data.messages,
          })
        );
    },
  });

  const {
    data: conversationDoctors,
    isLoading: isConversationDLoading,
    isError: isConversationDErrored,
  } = useQuery({
    queryKey: ["conversation-doctor", doctorId],
    queryFn: async () => {
      if (doctorId) {
        return apiGetConversationDoctors(doctorId);
      }
    },
    enabled: Boolean(doctorId),
    staleTime: 0,
    onSuccess: (data: any) => {
      if (data)
        return dispatch(
          addMessagesDoctors({ doctor_chat_id: data.doctor_chat_id, messages: data.messages })
        );
    },
  });

  const {
    data: cardPatient,
    isLoading: isCardPLoading,
    isError: isCardPErrored,
  } = useQuery({
    queryKey: ["patient-card", patientId],
    queryFn: async () => {
      if (conversationPatients?.user_id)
        return apiGetUserCard(
          conversationPatients.user_id,
          searchParams.get("anonymous") === "true"
        );
    },
    enabled: Boolean(conversationPatients?.user_id),
  });

  const {
    data: cardDoctors,
    isLoading: isCardDoctorsLoading,
    isError: isCardDoctorsErrored,
  } = useQuery({
    queryKey: ["doctor-card", conversationDoctors?.doctor_chat_id],
    queryFn: async () => {
      if (conversationDoctors?.doctor_chat_id)
        return apiGetDoctorChatCard(conversationDoctors?.doctor_chat_id);
    },
    enabled: Boolean(conversationDoctors?.doctor_chat_id),
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
  }, [searchParams, isMobile]);

  return React.useMemo(
    () => ({
      conversationPatients,
      isConversationLoading,
      isConversationErrored,
      conversationDoctors,
      isConversationDLoading,
      isConversationDErrored,
      cardPatient,
      isCardPLoading,
      isCardPErrored,
      cardDoctors,
      isCardDoctorsLoading,
      isCardDoctorsErrored,
      patientId,
      doctorId,
    }),
    [
      conversationPatients,
      isConversationLoading,
      isConversationErrored,
      conversationDoctors,
      isConversationDLoading,
      isConversationDErrored,
      cardPatient,
      isCardPLoading,
      isCardPErrored,
      cardDoctors,
      isCardDoctorsLoading,
      isCardDoctorsErrored,
      patientId,
      doctorId,
    ]
  );
};
