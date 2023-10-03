import React from "react";
import { useSearchParams } from "react-router-dom";

import { useQuery } from "react-query";

import { apiGetConversation, apiGetUserCard } from "../api";
import Pusher from "pusher-js";
import {
  SOCKET_PUSHER_KEY,
  SOCKET_PUSHER_CLUSTER,
  SOCKET_PUSHER_EVENT_RECEIVE,
  SOCKET_PUSHER_CHANNEL,
} from "@/config/app";

export const useConversation = () => {
  const [searchParams] = useSearchParams();
  const [id, setId] = React.useState<string | null>(null);
  const [incomingMessages, setIncomingMessages] = React.useState<any[]>([]);

  const [messages, setMessages] = React.useState<string[]>([]);
  const [newMessage, setNewMessage] = React.useState<string>("");

  const {
    data: conversation,
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
    queryKey: ["user-card", conversation?.user_id],
    queryFn: async () => {
      if (conversation?.user_id)
        return apiGetUserCard(conversation.user_id, searchParams.get("anonymous") === "true");
    },
    enabled: Boolean(conversation?.user_id),
  });

  React.useEffect(() => {
    // Configurează Pusher cu cheia ta
    const pusher = new Pusher(SOCKET_PUSHER_KEY, { cluster: SOCKET_PUSHER_CLUSTER });

    // Abonează-te la canalul Pusher
    // const channel = pusher.subscribe(SOCKET_PUSHER_CHANNEL + conversation?.chat_id);
    // if (conversation?.chat_id) {
    const channel = pusher.subscribe(SOCKET_PUSHER_CHANNEL + "26614");
    console.log(conversation?.chat_id);
    // Ascultă evenimentul 'new-message' și adaugă mesajul în starea locală
    channel.bind(SOCKET_PUSHER_EVENT_RECEIVE, (data: any) => {
      alert(JSON.stringify(data));
      setMessages((prevMessages) => [...prevMessages, data.message]);
    });
    // }

    // Cleanup: Dezabonează-te de la canal la dezasamblare
    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [conversation?.chat_id]);

  React.useEffect(() => {
    if (searchParams.has("id")) setId(searchParams.get("id") ?? null);
    else setId(null);
  }, [searchParams]);

  return React.useMemo(
    () => ({
      id,
      conversation,
      isConversationLoading,
      isConversationErrored,
      card,
      isCardLoading,
      isCardErrored,
    }),
    [
      card,
      conversation,
      id,
      isCardErrored,
      isCardLoading,
      isConversationErrored,
      isConversationLoading,
    ]
  );
};
