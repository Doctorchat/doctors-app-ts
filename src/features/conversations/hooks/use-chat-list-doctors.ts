import React from "react";
import { useQuery } from "react-query";
import { useConversationLayoutStore } from "../components/layout";
import { apiGetConversationsWithDoctors } from "../api";
import { useDispatch, useSelector } from "react-redux";
import usePusher from "./usePusher";
import { getUser } from "@/features/profile/api";
import { addListChatsDoctors, updateListChatsDoctors } from "@/store/slices/listChatsDoctorsSlice";
import { addDoctorInfo } from "@/store/slices/doctorInfoSlice";
import {
  SOCKET_PUSHER_CHANNEL_DOCTOR_DOCTORS_LIST,
  SOCKET_PUSHER_EVENT_DOCTOR_DOCTORS_LIST,
} from "@/config/app";
import { sortChatsByUpdatedAt } from "@/utils/sort-list";

export const useChatListDoctors = () => {
  const { listChatsDoctors } = useSelector((store: any) => ({
    listChatsDoctors: store.listChatsDoctors.data,
  }));
  const sessionUser = localStorage.getItem("session:user") ?? "";

  const current_user = !!sessionUser ? JSON.parse(localStorage.getItem("session:user") || "") : "";
  const conversationsType = useConversationLayoutStore((store) => store.conversationsType);
  const dispatch = useDispatch();

  const { pusher } = usePusher();
  const { data: doctorInfo } = useQuery({
    queryKey: ["getUser"],
    queryFn: async () => getUser(),
    onSuccess: (data: any) => {
      if (data) return dispatch(addDoctorInfo(data));
    },
  });

  const { data: dataListDoctors, isLoading: isLoadingListDoctors } = useQuery({
    queryKey: ["list-doctors", conversationsType],
    queryFn: async () => {
      if (doctorInfo) return apiGetConversationsWithDoctors(doctorInfo.id);
    },
    enabled: !!doctorInfo,
    onSuccess: (data: any) => {
      if (data) return dispatch(addListChatsDoctors(data));
    },
  });
  const listDoctors = React.useMemo(() => {
    return dataListDoctors && sortChatsByUpdatedAt(dataListDoctors);
  }, [dataListDoctors]);

  React.useEffect(() => {
    console.log(listDoctors, dataListDoctors);
    if (pusher) {
      //TODO
      const channel = pusher.subscribe(SOCKET_PUSHER_CHANNEL_DOCTOR_DOCTORS_LIST + current_user.id);
      channel.bind(SOCKET_PUSHER_EVENT_DOCTOR_DOCTORS_LIST, (data: any) => {
        const listMessage = JSON.parse(data.content_data);
        console.log(listMessage);
        dispatch(
          updateListChatsDoctors({
            unreadCount: listMessage.unreadCount,
            chat_id: listMessage.doctor_chat_id,
            lastMessage: listMessage.message,
            updated_at: listMessage.updated_at,
          })
        );
      });
      return () => {
        channel.unbind_all();
        channel.unsubscribe();
      };
    }
  }, [pusher, listChatsDoctors]);

  return React.useMemo(
    () => ({ listDoctors, isLoadingListDoctors }),
    [listDoctors, isLoadingListDoctors]
  );
};
