import React from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "react-query";
import { useSelector, useDispatch } from "react-redux";
import { apiGetConversation, apiGetUserCard } from "../api";
import {
  SOCKET_PUSHER_EVENT_RECEIVE,
  SOCKET_PUSHER_CHANNEL_DOCTOR,
  SOCKET_PUSHER_CHANNEL_PATIENT,
} from "@/config/app";
import usePusher from "./usePusher";
import { addMessage, addMessages } from "@/store/slices/chatContentSlice";

let hasProcessedData = false;
export const useConversation = () => {
  const [searchParams] = useSearchParams();
  const [id, setId] = React.useState<string | null>(null);

  const { pusher } = usePusher();
  const current_chat_id = searchParams.get("id");
  const current_user = JSON.parse(localStorage.getItem("session:user") || "");
  const dispatch = useDispatch();
  const { chatContent } = useSelector((store: any) => ({
    chatContent: store.chatContent?.conversation,
  }));

  const {
    data: conversationData,
    isLoading: isConversationLoading,
    isError: isConversationErrored,
  } = useQuery({
    queryKey: ["conversation", id],
    queryFn: async () => {
      if (id) return apiGetConversation(id);
    },
    enabled: Boolean(id),
  });

  const {
    data: card,
    isLoading: isCardLoading,
    isError: isCardErrored,
  } = useQuery({
    queryKey: ["user-card", conversationData?.user_id],
    queryFn: async () => {
      if (conversationData?.user_id)
        return apiGetUserCard(conversationData.user_id, searchParams.get("anonymous") === "true");
    },
    enabled: Boolean(id),
  });

  React.useEffect(() => {
    const role = current_user.role === 2;

    if (pusher && conversationData) {
      const channel = pusher.subscribe(
        (role ? SOCKET_PUSHER_CHANNEL_DOCTOR : SOCKET_PUSHER_CHANNEL_PATIENT) + current_chat_id
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
    if (conversationData) {
      if (!hasProcessedData || chatContent?.chat_id !== id) {
        hasProcessedData = true;
        dispatch(
          addMessages({ conversation: conversationData, messages: conversationData.messages })
        );
      }
    }
  }, [conversationData]);

  React.useEffect(() => {
    if (searchParams.has("id")) setId(searchParams.get("id") ?? null);
    else setId(null);
  }, [searchParams]);

  return React.useMemo(
    () => ({
      id,
      card,
      isCardLoading,
      isCardErrored,
      conversation: chatContent,
      isConversationLoading,
      isConversationErrored,
    }),
    [
      id,
      card,
      chatContent,
      isCardLoading,
      isCardErrored,
      isConversationErrored,
      isConversationLoading,
    ]
  );
};
