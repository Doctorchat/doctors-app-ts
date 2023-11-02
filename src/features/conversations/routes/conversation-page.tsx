import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "usehooks-ts";
import { View, useConversationLayoutStore } from "../components";
import { useConversation } from "../hooks";
import { Button, Sheet, SheetContent } from "@/components/ui";
import { AddChatDoctors, useNewChatDoctors } from "../components/new-chat";

import React from "react";
import QrCodeFull from "../components/qr-code";
import usePusher from "../hooks/usePusher";
import { useDispatch, useSelector } from "react-redux";
import {
  SOCKET_PUSHER_CHANNEL_DOCTOR,
  SOCKET_PUSHER_CHANNEL_DOCTOR_DOCTORS_CHAT,
  SOCKET_PUSHER_CHANNEL_PATIENT,
  SOCKET_PUSHER_EVENT_DOCTOR_DOCTORS_CHAT,
  SOCKET_PUSHER_EVENT_RECEIVE,
} from "@/config";
import { addMessage } from "@/store/slices/chatContentSlice";
import { addMessageDoctors } from "@/store/slices/chatContentDoctorsSlice";
import { Channel } from "pusher-js";

export default function ConversationPage() {
  const { t } = useTranslation();
  const { patientId, doctorId } = useConversation();
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 1024px)");
  const [searchParams] = useSearchParams();
  const setNewChatDoctors = useNewChatDoctors((store) => store.setOpen);
  const conversationsType = useConversationLayoutStore((store) => store.conversationsType);
  const currentPage = searchParams.has("patientId")
    ? "patients"
    : searchParams.has("doctorId")
    ? "doctors"
    : "";
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

  React.useEffect(() => {
    let patientConversation: Channel;
    let doctorConversation: Channel;
    const role = current_user.role === 2;

    if (pusher && (patientId ?? doctorId)) {
      if (patientId) {
        patientConversation = pusher.subscribe(
          (role ? SOCKET_PUSHER_CHANNEL_DOCTOR : SOCKET_PUSHER_CHANNEL_PATIENT) + patientId
        );

        patientConversation.bind(SOCKET_PUSHER_EVENT_RECEIVE, (data: any) => {
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
      } else if (doctorId) {
        doctorConversation = pusher.subscribe(
          SOCKET_PUSHER_CHANNEL_DOCTOR_DOCTORS_CHAT + doctorId + "-" + current_user.id
        );
        doctorConversation.bind(SOCKET_PUSHER_EVENT_DOCTOR_DOCTORS_CHAT, (data: any) => {
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
      }

      return () => {
        doctorConversation?.unsubscribe();
        patientConversation?.unsubscribe();
      };
    }
  }, [pusher, patientId, doctorId]);

  if (isMobile) {
    return (
      <Sheet open={Boolean(patientId ?? doctorId)} onOpenChange={() => navigate("/conversations")}>
        <SheetContent className="w-full p-0 sm:max-w-full">
          <View />
        </SheetContent>
      </Sheet>
    );
  }
  if ((patientId ?? doctorId) === null || (currentPage && conversationsType !== currentPage)) {
    return (
      <div className="flex items-center justify-center rounded-lg border border-neutral-200 lg:col-span-7 xl:col-span-8">
        {conversationsType === "doctors" ? (
          <Button
            size="default"
            className="xs:hover:bg-primary-hover bg-primary  hover:bg-primary-hover sm:hover:bg-primary-hover md:hover:bg-primary-hover"
            onClick={() => setNewChatDoctors(true)}
          >
            {t("conversations:create_conversation")}
          </Button>
        ) : (
          <QrCodeFull />
        )}
        <AddChatDoctors />
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-neutral-200 bg-white lg:col-span-7 xl:col-span-8">
      <View />
    </div>
  );
}
