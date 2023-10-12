import React from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "react-query";

import {
  apiGetConversation,
  apiGetConversationDoctors,
  apiGetDoctorChatCard,
  apiGetUserCard,
} from "../api";
import { useSelector, useDispatch } from "react-redux";
import {
  SOCKET_PUSHER_EVENT_RECEIVE,
  SOCKET_PUSHER_CHANNEL_DOCTOR,
  SOCKET_PUSHER_CHANNEL_PATIENT,
  SOCKET_PUSHER_CHANNEL_DOCTOR_DOCTORS_RECEVE,
  SOCKET_PUSHER_EVENT_DOCTOR_DOCTORS_RECEVE,
} from "@/config/app";
import usePusher from "./usePusher";
import { addMessage, addMessages } from "@/store/slices/chatContentSlice";
import { Conversation } from "../types";
import { addMessagesDoctors, addMessageDoctors } from "@/store/slices/chatContentDoctorsSlice";
import { useMediaQuery } from "usehooks-ts";

export const useConversation = () => {
  const [searchParams] = useSearchParams();
  const [patientId, setPatientId] = React.useState<string | null>(null);
  const [doctorId, setDoctorId] = React.useState<string | null>(null);
  const isMobile = useMediaQuery("(max-width: 1024px)");
  const { pusher } = usePusher();
  const sessionUser = localStorage.getItem("session:user") ?? "";
  const current_user = !!sessionUser ? JSON.parse(localStorage.getItem("session:user") || "") : "";
  const dispatch = useDispatch();
  const { chatContent } = useSelector((store: any) => ({
    chatContent: store.chatContent?.conversation,
  }));
  const { chatContentDoctors } = useSelector((store: any) => ({
    chatContentDoctors: store.chatContentDoctors.data,
  }));

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

  React.useEffect(() => {
    const role = current_user.role === 2;

    if (pusher && conversationPatients) {
      const channel = pusher.subscribe(
        (role ? SOCKET_PUSHER_CHANNEL_DOCTOR : SOCKET_PUSHER_CHANNEL_PATIENT) +
          (patientId ?? doctorId)
      );

      channel.bind(SOCKET_PUSHER_EVENT_RECEIVE, (data: any) => {
        const { content_data } = data;
        const { message } = JSON.parse(content_data);
        if (
          !chatContent.messages.some(
            (existingMessage: { id: any }) => existingMessage.id === message.id
          )
        ) {
          dispatch(addMessage(message));
        }
      });

      return () => {
        channel.unbind_all();
        channel.unsubscribe();
      };
    }
  }, [pusher, chatContent.messages]);

  React.useEffect(() => {
    if (pusher && conversationDoctors) {
      const channel = pusher.subscribe(
        SOCKET_PUSHER_CHANNEL_DOCTOR_DOCTORS_RECEVE +
          (patientId ?? doctorId) +
          "-" +
          current_user.id
      );
      channel.bind(SOCKET_PUSHER_EVENT_DOCTOR_DOCTORS_RECEVE, (data: any) => {
        const { content_data } = data;
        const { message } = JSON.parse(content_data);
        if (
          !chatContentDoctors.messages.some(
            (existingMessage: { id: any }) => existingMessage.id === message.id
          )
        ) {
          dispatch(addMessageDoctors(message));
        }
      });

      return () => {
        channel.unbind_all();
        channel.unsubscribe();
      };
    }
  }, [pusher, chatContentDoctors?.messages]);

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
