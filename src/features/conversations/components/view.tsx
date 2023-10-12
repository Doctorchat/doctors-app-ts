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
import { HeaderDoctors } from "./header-doctors";
import { useDispatch, useSelector } from "react-redux";
import { MessageBarDoctors } from "./message-bar-doctors";
import { apiReadMessages } from "../api";
import { updateUnReadMessage } from "@/store/slices/listChatsSlice";
import MessageContent from "./message-content";

export const View: React.FC = () => {
  const { t } = useTranslation();
  const { locale } = useAppI18n();
  const { cardPatient, patientId, doctorId } = useConversation();
  const ref = React.useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const scroll = React.useRef(0);
  const [autoScrollEnabled, setAutoScrollEnabled] = React.useState(true);

  const { chatConversation } = useSelector((store: any) => ({
    chatConversation: store.chatContent?.conversation,
  }));

  const { chatContentDoctors } = useSelector((store: any) => ({
    chatContentDoctors: store.chatContentDoctors.data,
  }));

  const grouped = React.useMemo(() => {
    const groups: Record<string, ConversationMessage[]> = {};

    if (patientId) {
      for (const message of chatConversation?.messages ?? []) {
        const groupKey = format(parseISO(message.created ?? message?.updated), "yyyy-MM-dd");

        if (groupKey in groups) {
          groups[groupKey].push(message);
        } else {
          groups[groupKey] = [message];
        }
      }
    } else if (doctorId) {
      for (const message of chatContentDoctors?.messages ?? []) {
        const groupKey = format(parseISO(message.created ?? message?.updated), "yyyy-MM-dd");

        if (groupKey in groups) {
          groups[groupKey].push(message);
        } else {
          groups[groupKey] = [message];
        }
      }
    }
    return Object.entries(groups).map(([key, messages]) => ({
      key,
      messages,
    }));
  }, [chatConversation?.messages, chatContentDoctors?.messages, patientId, doctorId]);

  const isAutoScrollEnabled = React.useRef(true);
  React.useEffect(() => {
    const onUpdate = () => {
      if (ref.current && isAutoScrollEnabled.current) {
        const el = ref.current;
        el.scrollTop = el.scrollHeight;
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
      observer.observe(ref.current, { childList: true, subtree: true });
      ref.current.scrollTop = ref.current.scrollHeight;
    }
    return () => {
      if (ref.current) {
        observer.disconnect();
      }
    };
  }, []);

  useEventListener(
    "scroll",
    () => {
      if (ref.current && autoScrollEnabled) {
        const el = ref.current;
        scroll.current = el.scrollTop + el.clientHeight - el.scrollHeight;
      }
    },
    ref
  );

  React.useEffect(() => {
    if (chatConversation?.messages) {
      //TODO la doctors list
      const unreadedMessages = chatConversation?.messages
        .filter((msg: any) => !msg.seen)
        .map((msg: any) => msg.id)
        .join(",");
      if (unreadedMessages.length) {
        const fetchDataAndDelay = async () => {
          setTimeout(async () => {
            dispatch(updateUnReadMessage({ id: +chatConversation?.chat_id, unread: 0 }));
            await apiReadMessages({ id: chatConversation?.chat_id, messages: unreadedMessages });
          }, 750);
        };
        fetchDataAndDelay();
      }
    }
  }, [chatConversation?.messages]);

  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-lg">
      {patientId ? <Header /> : <HeaderDoctors />}

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
                  title={
                    message.side === "in" ? cardPatient?.name ?? t("common:untitled") : t("you")
                  }
                  timestamp={message?.updated ?? ""}
                />
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
                {message.content && !message.files.length && (
                  <MessageContent isAutoScrollEnabled={isAutoScrollEnabled} message={message} />
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
              </Message>
            ))}
          </div>
        ))}
      </div>
      {patientId ? (
        <>
          <ApprovalRequest />
          <MessageBar />
        </>
      ) : (
        <MessageBarDoctors />
      )}
    </div>
  );
};
