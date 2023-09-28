import React from "react";
import { useSearchParams } from "react-router-dom";

import { useQuery } from "react-query";

import { apiGetConversation, apiGetUserCard } from "../api";
import Pusher from "pusher-js";
import io, { Socket } from "socket.io-client";

export const useConversation = () => {
  const [searchParams] = useSearchParams();
  const [id, setId] = React.useState<string | null>(null);
  const [incomingMessages, setIncomingMessages] = React.useState<any[]>([]);

  React.useEffect(() => {
    Pusher.logToConsole = true;

    const pusher = new Pusher("7af3d8908b31f066b0a2", {
      cluster: "eu",
    });

    const channel = pusher.subscribe("chat-patient");
    channel.bind("receive-message-patient", (data: any) => {
      console.log(
        "Here -------------------------------------------------------------------------------",
        data
      );
      alert(JSON.stringify(data));
      setIncomingMessages((prev) => [...prev, data]);
    });
    return () => {
      // pusher.unsubscribe("chat"); // Dezabonați-vă când componenta este demontată
      // pusher.disconnect();
    };
  }, []);

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
