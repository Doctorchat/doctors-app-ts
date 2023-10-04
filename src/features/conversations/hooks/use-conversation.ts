import React from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "react-query";
import { apiGetConversation, apiGetUserCard } from "../api";
import {
  SOCKET_PUSHER_EVENT_RECEIVE,
  SOCKET_PUSHER_CHANNEL_DOCTOR,
  SOCKET_PUSHER_CHANNEL_PATIENT,
} from "@/config/app";
import usePusher from "./usePusher";
import { useChat } from "../components/chat-context";
import { Conversation } from "../types";
let hasProcessedData = false;
let hasProcessedData1 = false;
export const useConversation = () => {
  const [searchParams] = useSearchParams();
  const [id, setId] = React.useState<string | null>(null);

  const { pusher } = usePusher();
  const current_chat_id = searchParams.get("id");
  const current_user = JSON.parse(localStorage.getItem("session:user") || "");
  const { state, dispatch } = useChat();
  // const [conversation, setConversation] = React.useState<null | any>(null);

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

  // const {
  //   data: card,
  //   isLoading: isCardLoading,
  //   isError: isCardErrored,
  // } = useQuery({
  //   queryKey: ["user-card", conversation?.user_id],
  //   queryFn: async () => {
  //     if (conversation?.user_id)
  //       return apiGetUserCard(conversation.user_id, searchParams.get("anonymous") === "true");
  //   },
  //   enabled: Boolean(conversation?.user_id),
  // });
  const socketChannels = {};

  React.useEffect(() => {
    const role = current_user.role === 2;

    if (pusher && conversationData && !hasProcessedData1) {
      const channel = pusher.subscribe(
        (role ? SOCKET_PUSHER_CHANNEL_DOCTOR : SOCKET_PUSHER_CHANNEL_PATIENT) + current_chat_id
      );
      channel.bind(SOCKET_PUSHER_EVENT_RECEIVE, (data: any) => {
        const { content_data } = data;
        const { message } = JSON.parse(content_data);
        console.log(message);
        if (!hasProcessedData1) {
          hasProcessedData1 = true;
          const payloaData = message;
          // const payloaData = messages.message;
          console.log(message);
          dispatch({ type: "ADD_MESSAGE", payload: payloaData });

          alert(JSON.stringify(data));
          console.log(state, conversationData?.messages.length);
        }
      });

      return () => {
        // channel.unbind("event-name");

        channel.unbind_all();
        channel.unsubscribe();
        // pusher.unsubscribe("your-channel-name");
      };
    }
  }, [pusher, conversationData]);

  React.useEffect(() => {
    if (conversationData) {
      if (!hasProcessedData) {
        hasProcessedData = true;
        dispatch({ type: "ADD_MESSAGES", payload: conversationData });
      }
    }
  }, [conversationData]);

  React.useEffect(() => {
    if (searchParams.has("id")) setId(searchParams.get("id") ?? null);
    else setId(null);
  }, [searchParams]);
  // console.log(conversation, state.conversation);

  // console.log(state.messages, conversation?.messages);

  return React.useMemo(
    () => ({
      id,
      conversation: state.conversation,
      isConversationLoading,
      isConversationErrored,
    }),
    [state.conversation, id, isConversationErrored, isConversationLoading]
  );
};
