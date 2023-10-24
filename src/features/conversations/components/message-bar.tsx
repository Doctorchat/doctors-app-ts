import React from "react";

import {
  ArrowPathRoundedSquareIcon,
  ClipboardDocumentListIcon,
  DocumentArrowDownIcon,
  DocumentArrowUpIcon,
  PaperClipIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { useTranslation } from "react-i18next";
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
import { RecomandAnalysis, useRecomandAnalysisStore } from "./recomand-analysis";
import { useMediaQuery } from "usehooks-ts";
import { useNavigate } from "react-router-dom";
import { CloseConversation, useCloseConversation } from "./close-conversation";

export const MessageBar: React.FC = () => {
  const { t } = useTranslation();
  const { conversationPatients, patientId } = useConversation();
  const { toast } = useToast();
  const conversationsType = useConversationLayoutStore((store) => store.conversationsType);
  const setUploadFileOpen = useUploadFileStore((store) => store.setOpen);
  const setRecomandationAnalysisOpen = useRecomandAnalysisStore((store) => store.setOpen);
  const setRequestFileOpen = useRequestFileStore((store) => store.setOpen);
  const setCloseConversation = useCloseConversation((store) => store.setOpen);

  const [content, setContent] = React.useState("");
  const [isSending, setIsSending] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const navigate = useNavigate();

  const onSendMessageHandler = async () => {
    if (patientId) {
      setIsSending(true);
      try {
        await apiSendMessage({
          chat_id: parseInt(patientId),
          content,
        });
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

  if (
    (conversationPatients?.isAccepted && conversationPatients?.status === "open") ||
    (conversationPatients?.isAccepted && conversationPatients?.status === "responded")
  ) {
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
                    <DropdownMenuItem
                      onClick={() =>
                        isMobile
                          ? navigate(
                              `/recomandation-analyze?id=${conversationPatients.chat_id}?type=${conversationsType}`
                            )
                          : setRecomandationAnalysisOpen(true)
                      }
                    >
                      {t("conversations:recomand_analysis_dialog:title")}
                      <DropdownMenuShortcut>
                        <ClipboardDocumentListIcon className="h-5 w-5" />
                      </DropdownMenuShortcut>
                    </DropdownMenuItem>
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
                {conversationPatients?.status !== "responded" && (
                  <Button variant="ghost" size="icon" onClick={() => setCloseConversation(true)}>
                    <XMarkIcon className="h-5 w-5" />
                  </Button>
                )}
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

        <UploadFile senderFiler="patients" />
        <RequestFile />
        <CloseConversation />
        <RecomandAnalysis conversationsType={conversationsType} id={patientId} />
      </>
    );
  }

  return null;
};
