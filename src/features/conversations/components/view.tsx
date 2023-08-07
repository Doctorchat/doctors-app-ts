import React from "react";

import { format, parseISO } from "date-fns";
import { ro, ru } from "date-fns/locale";
import { useQuery } from "react-query";

import { Header } from "./header";
import { Message, MessageBubble, MessageBubbleText, MessageHeader } from "./message";
import { apiGetConversation, apiGetUserCard } from "../api";
import { ConversationMessage } from "../types";

import { ScrollArea } from "@/components/ui";
import { useAppI18n } from "@/hooks";
import { cn } from "@/utils";

export interface ViewProps {
  id: string | null;
  anonymous: boolean;
}

export const View: React.FC<ViewProps> = ({ id, anonymous }) => {
  const { locale } = useAppI18n();

  const { data: conversation } = useQuery({
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
      if (conversation?.user_id) return apiGetUserCard(conversation.user_id, anonymous);
    },
    enabled: Boolean(conversation?.user_id),
  });

  const grouped = React.useMemo(() => {
    const groups: Record<string, ConversationMessage[]> = {};

    for (const message of conversation?.messages ?? []) {
      const groupKey = format(parseISO(message.updated), "yyyy-MM-dd");

      if (groupKey in groups) {
        groups[groupKey].push(message);
      } else {
        groups[groupKey] = [message];
      }
    }

    return Object.entries(groups).map(([key, messages]) => ({
      key,
      messages,
    }));
  }, [conversation?.messages]);

  return (
    <div className="flex h-full flex-col">
      <Header card={card} isLoading={isCardLoading || (!conversation?.user_id && !isCardErrored)} />
      <div className="flex-1 overflow-hidden p-px">
        <ScrollArea vertical className="h-full">
          <div className="space-y-4 p-5">
            {grouped.map(({ key, messages }) => (
              <div key={key} className="space-y-2">
                <div className={cn("relative flex h-10 items-center px-5")}>
                  <span
                    className={cn(
                      "absolute left-0 top-1/2 z-0 block h-px w-full border-b border-dashed border-typography-primary",
                      "-translate-y-1/2",
                    )}
                  />
                  <span className="relative block bg-white px-1 text-sm font-medium text-typography-primary">
                    {format(parseISO(key), "dd MMMM yyyy", { locale: locale === "ro" ? ro : ru })}
                  </span>
                </div>
                {messages.map((message) => (
                  <Message key={message.id} align={message.side === "in" ? "left" : "right"}>
                    <MessageHeader title="John Doe" timestamp={message.updated} />
                    <MessageBubble>
                      <MessageBubbleText>{message.content}</MessageBubbleText>
                    </MessageBubble>
                  </Message>
                ))}
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
