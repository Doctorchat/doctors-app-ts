import React from "react";

import {
  ArrowPathRoundedSquareIcon,
  DocumentArrowDownIcon,
  DocumentArrowUpIcon,
  PaperClipIcon,
} from "@heroicons/react/24/outline";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "react-query";

import { useConversationLayoutStore } from "./layout";
import { MessageTemplates, useMessageTemplatesStore } from "./message-templates";
import { RequestFile, useRequestFileStore } from "./request-file";
import { UploadFile, useUploadFileStore } from "./upload-file";
import { apiSendMessage } from "../api";
import { useConversation } from "../hooks";

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
  Spinner,
  Textarea,
} from "@/components/ui";
import { useToast } from "@/hooks";
import { cn, getApiErrorMessages } from "@/utils";
import Pusher from "pusher-js";
import { SOCKET_PUSHER_CLUSTER, SOCKET_PUSHER_EVENT_RECEIVE, SOCKET_PUSHER_KEY } from "@/config";
import { useSearchParams } from "react-router-dom";
import { useChat } from "./chat-context";

export const MessageBar: React.FC = () => {
  const { t } = useTranslation();
  const { id, conversation } = useConversation();
  // console.log(conversation)
  // console.log(conversation);
  const { toast } = useToast();
  const [chatIdWs, setChatIdWs] = React.useState<string | null>(null);
  const [searchParams] = useSearchParams();

  // React.useEffect(() => {
  //   const pusher = new Pusher(SOCKET_PUSHER_KEY, { cluster: SOCKET_PUSHER_CLUSTER });
  //   const current_chat_id = searchParams.get("id");
  //   const channel = pusher.subscribe(SOCKET_PUSHER_CHANNEL + current_chat_id);
  //   const current_user = JSON.parse(localStorage.getItem("session:user") || "");

  //   channel.bind(SOCKET_PUSHER_EVENT_RECEIVE, (data: any) => {
  //     const { message } = data;
  //     const { chat_id, user_id } = message;
  //     current_chat_id && parseInt(current_chat_id);

  //     //  console.log(searchParams.get("id"));
  //     console.log(current_user.id);

  //     alert(JSON.stringify(data));
  //     // setMessages((prevMessages) => [...prevMessages, data.message]);
  //   });
  //   return () => {
  //     channel.unbind_all();
  //     channel.unsubscribe();
  //   };
  // }, []);

  const conversationsType = useConversationLayoutStore((store) => store.conversationsType);
  const queryClient = useQueryClient();
  const setUploadFileOpen = useUploadFileStore((store) => store.setOpen);
  const setRequestFileOpen = useRequestFileStore((store) => store.setOpen);
  const setMessageTemplatesOpen = useMessageTemplatesStore((store) => store.setOpen);

  const [content, setContent] = React.useState("");
  const [isSending, setIsSending] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);
  const { state, dispatch } = useChat();
  const onSendMessageHandler = async () => {
    if (conversation?.chat_id) {
      setIsSending(true);
      try {
        await apiSendMessage({
          chat_id: conversation.chat_id,
          content,
        });

        // dispatch({ type: "ADD_MESSAGE", payload: newMessage });

        // await Promise.allSettled([
        //   queryClient.invalidateQueries(["conversations", conversationsType]),
        //   queryClient.invalidateQueries(["conversation", id]),
        // ]);
        setContent("");
      } catch (error) {
        toast({
          variant: "destructive",
          title: "common:something_went_wrong",
          description: getApiErrorMessages(error),
        });
      } finally {
        setIsSending(false);
      }
    }
  };

  if (conversation?.isAccepted && conversation?.status === "open") {
    return (
      <>
        <div className="p-3 md:p-5 lg:p-3 xl:p-5">
          <div
            className={cn("overflow-hidden rounded-lg border border-neutral-200", {
              "ring-1 ring-neutral-400": isFocused,
            })}
          >
            <Textarea
              minRows={1}
              maxRows={10}
              placeholder={`${t("conversations:enter_message")}...`}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  onSendMessageHandler();
                }
              }}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className="rounded-none border-none px-3.5 py-3 shadow-none focus:ring-0 focus-visible:ring-0"
            />
            <div className="flex items-center justify-between space-x-2 p-2">
              <div className="flex items-center space-x-1.5">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <PaperClipIcon className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side="top" align="start" className="w-48">
                    <DropdownMenuItem onClick={() => setUploadFileOpen(true)}>
                      {t("conversations:upload_file")}
                      <DropdownMenuShortcut>
                        <DocumentArrowUpIcon className="h-5 w-5" />
                      </DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setRequestFileOpen(true)}>
                      {t("conversations:request_file")}
                      <DropdownMenuShortcut>
                        <DocumentArrowDownIcon className="h-5 w-5" />
                      </DropdownMenuShortcut>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button variant="ghost" size="icon" onClick={() => setMessageTemplatesOpen(true)}>
                  <ArrowPathRoundedSquareIcon className="h-5 w-5" />
                </Button>
              </div>
              <Button
                variant="default"
                size="icon"
                disabled={isSending || content.length === 0}
                onClick={onSendMessageHandler}
              >
                {isSending ? (
                  <Spinner className="h-5 w-5 text-white" />
                ) : (
                  <PaperAirplaneIcon className="h-5 w-5 text-white" />
                )}
              </Button>
            </div>
          </div>
        </div>

        <UploadFile />
        <RequestFile />
        <MessageTemplates />
      </>
    );
  }

  return null;
};
