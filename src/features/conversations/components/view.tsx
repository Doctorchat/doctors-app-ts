import React from "react";

import { format, parseISO } from "date-fns";
import { useTranslation } from "react-i18next";
import { useEventListener } from "usehooks-ts";
import EditIcon from "../../../assets/icons/edit.svg";
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

export const View: React.FC = () => {
  const { t } = useTranslation();
  const { locale } = useAppI18n();
  const { cardPatient, patientId, doctorId } = useConversation();
  const ref = React.useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const scroll = React.useRef(0);
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

  React.useEffect(() => {
    const onUpdate = () => {
      if (ref.current) {
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
      if (ref.current) {
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

                {message.content && (
                  <>
                    <MessageBubble variant={message.side === "in" ? "primary" : "secondary"}>
                      <MessageBubbleText>{message.content}</MessageBubbleText>
                    </MessageBubble>
                    <button
                      className=" z-9 !m-0 h-[18px] max-h-[40px] min-h-[26px] w-[18px] min-w-[26px] max-w-[40px] cursor-pointer  rounded-full border border-neutral-200  bg-white shadow-lg"
                      type="button"
                    >
                      <span className="flex items-center justify-center">
                        <svg
                          height={13}
                          width={13}
                          aria-hidden="true"
                          focusable="false"
                          data-prefix="far"
                          data-icon="pen"
                          role="img"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 512 512"
                          className="svg-inline--fa fa-pen fa-w-16 fa-7x"
                        >
                          <path
                            fill="currentColor"
                            d="M493.26 56.26l-37.51-37.51C443.25 6.25 426.87 0 410.49 0s-32.76 6.25-45.25 18.74l-74.49 74.49L256 127.98 12.85 371.12.15 485.34C-1.45 499.72 9.88 512 23.95 512c.89 0 1.79-.05 2.69-.15l114.14-12.61L384.02 256l34.74-34.74 74.49-74.49c25-25 25-65.52.01-90.51zM118.75 453.39l-67.58 7.46 7.53-67.69 231.24-231.24 31.02-31.02 60.14 60.14-31.02 31.02-231.33 231.33zm340.56-340.57l-44.28 44.28-60.13-60.14 44.28-44.28c4.08-4.08 8.84-4.69 11.31-4.69s7.24.61 11.31 4.69l37.51 37.51c6.24 6.25 6.24 16.4 0 22.63z"
                          ></path>
                        </svg>
                      </span>
                    </button>
                  </>
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
