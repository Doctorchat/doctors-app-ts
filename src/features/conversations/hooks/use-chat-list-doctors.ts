import React from "react";
import { useQuery } from "react-query";
import { useConversationLayoutStore } from "../components/layout";
import { apiGetConversationsWithDoctors } from "../api";
import { useDispatch, useSelector } from "react-redux";
import usePusher from "./usePusher";
// import { SOCKET_PUSHER_CHANNEL_LIST_CHATS, SOCKET_PUSHER_EVENT_LIST_CHATS } from "@/config/app";
import { getUser } from "@/features/profile/api";
import { addListChatsDoctors } from "@/store/slices/listChatsDoctorsSlice";
import { addDoctorInfo } from "@/store/slices/doctorInfoSlice";
import { DoctorInfo } from "@/store/types/chatTypes";

export const useChatListDoctors = () => {
  const { listChatsDoctors } = useSelector((store: any) => ({
    listChatsDoctors: store.listChatsDoctors.data,
  }));

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

  const { data: listDoctors, isLoading: isLoadingListDoctors } = useQuery({
    queryKey: ["list-doctors", conversationsType],
    queryFn: async () => {
      if (doctorInfo) return apiGetConversationsWithDoctors(doctorInfo.id);
    },
    enabled: !!doctorInfo,
    onSuccess: (data: any) => {
      if (data) return dispatch(addListChatsDoctors(data));
    },
  });

  React.useEffect(() => {
    if (pusher && listDoctors) {
      //TODO
      //   const channel = pusher.subscribe(SOCKET_PUSHER_CHANNEL_LIST_CHATS + current_user.id);
      //   channel.bind(SOCKET_PUSHER_EVENT_LIST_CHATS, (data: any) => {
      //     const { chatList, chat_id } = data;
      //     const chat_update = JSON.parse(chatList);
      //     dispatch(updateListChats({ id: chat_id, updatedData: chat_update }));
      //   });
      //   return () => {
      //     channel.unbind_all();
      //     channel.unsubscribe();
      //   };
    }
  }, [pusher, listChatsDoctors]);

  return React.useMemo(
    () => ({ listDoctors, isLoadingListDoctors }),
    [listDoctors, isLoadingListDoctors]
  );
};
