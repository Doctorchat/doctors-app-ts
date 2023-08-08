import React from "react";

import { format, parseISO } from "date-fns";
import { ro, ru } from "date-fns/locale";
import { useTranslation } from "react-i18next";

import { ApprovalRequest } from "./approval-request";
import { Header } from "./header";
import {
  Message,
  MessageBubble,
  MessageBubbleFile,
  MessageBubbleText,
  MessageHeader,
} from "./message";
import { useConversation } from "../hooks";
import { ConversationMessage } from "../types";

import { ScrollArea } from "@/components/ui";
import { useAppI18n } from "@/hooks";
import { cn } from "@/utils";

export const View: React.FC = () => {
  const { t } = useTranslation();
  const { locale } = useAppI18n();
  const { card, isCardLoading, isCardErrored, conversation } = useConversation();

  const grouped = React.useMemo(() => {
    const groups: Record<string, ConversationMessage[]> = {};

    for (const message of conversation?.messages ?? []) {
      const groupKey = format(parseISO(message.created), "yyyy-MM-dd");

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
    <div className="relative flex h-full flex-col overflow-hidden">
      <Header card={card} isLoading={isCardLoading || (!conversation?.user_id && !isCardErrored)} />
      <div className="flex-1 overflow-hidden p-px">
        <ScrollArea vertical className="h-full">
          <div className="space-y-4 p-3 md:p-5 lg:p-3 xl:p-5">
            {grouped.map(({ key, messages }) => (
              <div key={key} className="space-y-2.5">
                <div className={cn("relative flex h-10 items-center justify-center px-5")}>
                  <span
                    className={cn(
                      "absolute left-0 top-1/2 z-0 block h-px w-full border-b border-dashed border-typography-secondary",
                      "-translate-y-1/2",
                    )}
                  />
                  <span className="relative block bg-white px-1 text-sm font-medium text-typography-secondary">
                    {format(parseISO(key), "dd MMMM yyyy", { locale: locale === "ro" ? ro : ru })}
                  </span>
                </div>
                {messages.map((message) => (
                  <Message key={message.id} align={message.side === "in" ? "left" : "right"}>
                    <MessageHeader
                      title={message.side === "in" ? card?.name : t("you")}
                      timestamp={message.updated}
                    />
                    <MessageBubble variant={message.side === "in" ? "primary" : "secondary"}>
                      <MessageBubbleText>{message.content}</MessageBubbleText>
                    </MessageBubble>
                    {message.files.length > 0 && (
                      <MessageBubble className="space-y-1">
                        {message.files.map((file) => (
                          <MessageBubbleFile key={file.id} file={file} />
                        ))}
                      </MessageBubble>
                    )}
                  </Message>
                ))}
              </div>
            ))}
          </div>
        </ScrollArea>
        <ApprovalRequest />
      </div>
    </div>
  );
};
