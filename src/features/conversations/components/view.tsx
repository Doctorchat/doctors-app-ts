import React from "react";

import { format, parseISO } from "date-fns";
import { useTranslation } from "react-i18next";
import { useEventListener } from "usehooks-ts";

import { ApprovalRequest } from "./approval-request";
import { Header } from "./header";
import {
  Message,
  MessageBubble,
  MessageBubbleFile,
  MessageBubbleText,
  MessageHeader,
} from "./message";
import { MessageBar } from "./message-bar";
import { useConversation } from "../hooks";
import { ConversationMessage } from "../types";

import { useAppI18n } from "@/hooks";
import { cn } from "@/utils";

export const View: React.FC = () => {
  const { t } = useTranslation();
  const { locale } = useAppI18n();
  const { card, conversation } = useConversation();

  const ref = React.useRef<HTMLDivElement>(null);
  const scroll = React.useRef(0);

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

  React.useEffect(() => {
    const onUpdate = () => {
      if (ref.current) {
        const el = ref.current;

        if (scroll.current === 0) {
          el.scrollTo({
            top: el.scrollHeight,
            behavior: "auto",
          });
        }
      }
    };

    const observer = new MutationObserver(onUpdate);

    if (ref.current) {
      observer.observe(ref.current, { childList: true });
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  useEventListener(
    "scroll",
    () => {
      if (ref.current) {
        const el = ref.current;
        scroll.current = el.scrollTop + el.clientHeight - el.scrollHeight;
      }
    },
    ref
  );

  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-lg">
      <Header />

      <div ref={ref} className="flex-1 space-y-4 overflow-y-auto p-3 md:p-5 lg:p-3 xl:p-5">
        {grouped.map(({ key, messages }) => (
          <div key={key} className="space-y-2.5">
            <div className={cn("relative flex h-10 items-center justify-center px-5")}>
              <span
                className={cn(
                  "absolute left-0 top-1/2 z-0 block h-px w-full border-b border-dashed border-typography-secondary",
                  "-translate-y-1/2"
                )}
              />
              <span className="relative block bg-white px-1 text-sm font-medium text-typography-secondary">
                {format(parseISO(key), "dd MMMM yyyy", { locale: locale() })}
              </span>
            </div>

            {messages.map((message) => (
              <Message key={message.id} align={message.side === "in" ? "left" : "right"}>
                <MessageHeader
                  title={message.side === "in" ? card?.name ?? t("common:untitled") : t("you")}
                  timestamp={message.updated}
                />

                {message.content && (
                  <MessageBubble variant={message.side === "in" ? "primary" : "secondary"}>
                    <MessageBubbleText>{message.content}</MessageBubbleText>
                  </MessageBubble>
                )}

                {message.files.length > 0 && (
                  <MessageBubble
                    variant={message.side === "in" ? "primary" : "secondary"}
                    className="space-y-1"
                  >
                    {message.files.map((file) => (
                      <MessageBubbleFile key={file.id} file={file} />
                    ))}
                  </MessageBubble>
                )}

                {message.recommendations?.length > 0 && (
                  <MessageBubble
                    variant={message.side === "in" ? "primary" : "secondary"}
                    className="space-y-1"
                  >
                    {t("conversations:recomand_analysis_dialog:recomandation_text")}
                    {message.recommendations.map((recomandation, index) => (
                      <MessageBubbleText>{index + 1 + ". " + recomandation.name}</MessageBubbleText>
                    ))}
                  </MessageBubble>
                )}
              </Message>
            ))}
          </div>
        ))}
      </div>

      <ApprovalRequest />
      <MessageBar />
    </div>
  );
};
