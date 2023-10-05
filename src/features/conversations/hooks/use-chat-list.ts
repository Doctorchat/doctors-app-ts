import React from "react";
import { useQuery } from "react-query";
import { useConversationLayoutStore } from "../components/layout";
import { apiGetConversationsWithPatients } from "../api";
import { addListChats, updateListChats } from "@/store/slices/listChatsSlice";
import { useDispatch, useSelector } from "react-redux";
import usePusher from "./usePusher";
import { SOCKET_PUSHER_CHANNEL_LIST_CHATS, SOCKET_PUSHER_EVENT_LIST_CHATS } from "@/config/app";
let hasProcessedData = false;
export const useChatList = () => {
  const { listChats } = useSelector((store: any) => ({
    listChats: store.listChats.data,
  }));
  const conversationsType = useConversationLayoutStore((store) => store.conversationsType);
  const dispatch = useDispatch();
  const { pusher } = usePusher();
  const { data: conversations, isLoading } = useQuery({
    queryKey: ["conversations", conversationsType],
    queryFn: async () => {
      return apiGetConversationsWithPatients();
    },
  });
  React.useEffect(() => {
    if (conversations && !hasProcessedData) {
      hasProcessedData = true;
      dispatch(addListChats(conversations));
    }
  }, [conversations]);

  const current_user = JSON.parse(localStorage.getItem("session:user") || "");
  React.useEffect(() => {
    if (pusher && conversations) {
      const channel = pusher.subscribe(SOCKET_PUSHER_CHANNEL_LIST_CHATS + current_user.id);
      channel.bind(SOCKET_PUSHER_EVENT_LIST_CHATS, (data: any) => {
        const { chatList, chat_id } = data;
        const chat_update = JSON.parse(chatList);
        dispatch(updateListChats({ id: chat_id, updatedData: chat_update }));
      });

      return () => {
        channel.unbind_all();
        channel.unsubscribe();
      };
    }
  }, [pusher, listChats]);

  return React.useMemo(() => ({ conversations, isLoading }), [conversations, isLoading]);
};
