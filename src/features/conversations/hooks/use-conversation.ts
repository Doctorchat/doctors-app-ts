import React from "react";
import { useSearchParams } from "react-router-dom";

import { useQuery } from "react-query";

import { apiGetConversation, apiGetUserCard } from "../api";
import Pusher from "pusher-js";
import io from "socket.io-client";

export const useConversation = () => {
  const [searchParams] = useSearchParams();
  const [id, setId] = React.useState<string | null>(null);

  // React.useEffect(() => {
  //   const socket = io("https://ws.api-dev.doctorchat.md", {
  //     path: "/app/52e9008bf40030491f16?protocol=7&client=js&version=5.1.0",
  //     transports: ["websocket"],
  //   });
  //   socket.emit("subscribe", { channel: "chat" });
  //   console.log(socket);

  //   // Returnați o funcție pentru a gestiona deconectarea socket-ului la demontare
  //   return () => {
  //     socket.disconnect();
  //   };
  // }, []);

  React.useEffect(() => {
    const pusher = new Pusher("52e9008bf40030491f16", {
      cluster: "eu",
    });

    const channel = pusher.subscribe("chat");
    channel.bind("MessageSent", (newMessage: any) => {
      console.log(newMessage);
      // setMessages([...messages, newMessage]);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, []);

  // let allMessages: any[];

  // React.useEffect(() => {
  //   Pusher.logToConsole = true;

  //   const pusher = new Pusher("52e9008bf40030491f16", {
  //     cluster: "eu",
  //   });

  //   const channel = pusher.subscribe("chat");
  //   console.log("channel", channel);
  //   console.log("pusher", pusher);

  //   channel.bind("message", function (data: any) {
  //     allMessages.push(data ?? []);
  //     console.log("Here");
  //     // setMessages(allMessages ?? []);
  //   });
  // }, []);

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
