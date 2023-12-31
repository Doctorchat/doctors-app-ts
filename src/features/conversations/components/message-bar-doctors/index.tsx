import React from "react";

import { DocumentArrowUpIcon, PaperClipIcon } from "@heroicons/react/24/outline";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { useTranslation } from "react-i18next";

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

import { UploadFile, useUploadFileStore } from "..";

import { apiSendMessageDoctors } from "../../api";
import { useConversation } from "../../hooks/use-conversation";

export const MessageBarDoctors: React.FC = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const setUploadFileOpen = useUploadFileStore((store) => store.setOpen);
  const [content, setContent] = React.useState("");
  const [isSending, setIsSending] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);
  const { doctorId } = useConversation();
  const sessionUser = localStorage.getItem("session:user") ?? "";
  const current_user = !!sessionUser ? JSON.parse(localStorage.getItem("session:user") || "") : "";

  const onSendMessageHandler = async () => {
    if (doctorId) {
      setIsSending(true);
      try {
        const data = {
          doctor_chat_id: parseInt(doctorId),
          content: content,
          type: "standard",
          user_id: current_user.id,
          file: null,
        };
        await apiSendMessageDoctors(data);
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
              // if (e.key === "Enter" && !e.shiftKey) {
              //   e.preventDefault();
              //   onSendMessageHandler();
              // }
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
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <Button
              variant="primary"
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
      <UploadFile senderFiler="doctors" />
    </>
  );
};
