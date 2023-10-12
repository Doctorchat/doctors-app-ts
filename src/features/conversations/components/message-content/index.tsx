import { Button, FormControl, FormField, FormItem, FormLabel, Textarea } from "@/components/ui";
import { FormProvider, useForm } from "react-hook-form";
import { MessageBubble, MessageBubbleText, useConversationLayoutStore } from "..";
import { EditIcon } from "../edit-message";
import React, { useEffect } from "react";
import { t } from "i18next";
import { ConversationMessage } from "../../types";
import { toast } from "@/hooks";
import { apiEditMessage } from "../../api";
import { getApiErrorMessages } from "@/utils";
import { useDispatch, useSelector } from "react-redux";
import { updateMessage } from "@/store/slices/chatContentSlice";
import { hasPassedTenMinutes } from "@/utils/calculate-edit-message";
import { useQueryClient } from "react-query";
interface MessageProps {
  message: ConversationMessage;
  isAutoScrollEnabled: any;
}
const MessageContent: React.FC<MessageProps> = ({ message, isAutoScrollEnabled }) => {
  const form = useForm({});
  const conversationsType = useConversationLayoutStore((store) => store.conversationsType);
  const [isEditing, setIsEditing] = React.useState(false);
  const [contentMessage, setContentMessage] = React.useState(message.content ?? "");
  const [isEditingMessageId, setIsEditingMessageId] = React.useState(0);
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const toggleMessageEditStatus = React.useCallback(
    (status: any) => () => {
      isAutoScrollEnabled.current = false;
      console.log(status);
      setIsEditing(status);
      setIsEditingMessageId(message.id);
    },
    []
  );

  const [isWithinTenMinutes, setIsWithinTenMinutes] = React.useState(
    hasPassedTenMinutes(message.created)
  );

  useEffect(() => {
    // Verificați la fiecare minut dacă a trecut 10 minute
    const intervalId = setInterval(() => {
      const withinTenMinutes = hasPassedTenMinutes(message.created);
      setIsWithinTenMinutes(withinTenMinutes);
      if (!withinTenMinutes) {
        clearInterval(intervalId); // Oprim verificarea după 10 minute
      }
    }, 60000); // 60000 milisecunde = 1 minut

    return () => {
      clearInterval(intervalId); // Curățăm intervalul la demontare
    };
  }, [message.created]);

  const onEditMessage = async () => {
    const data = { id: isEditingMessageId, content: contentMessage };
    try {
      dispatch(updateMessage(data));
      await apiEditMessage(data);
      await Promise.allSettled([
        queryClient.invalidateQueries(["list-patients", conversationsType]),
      ]);
      setTimeout(() => {
        isAutoScrollEnabled.current = true;
      }, 100);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "common:something_went_wrong",
        description: getApiErrorMessages(error),
      });
    } finally {
      setIsEditing(false);
    }
  };
  return (
    <>
      {isEditing && message.id === isEditingMessageId ? (
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onEditMessage)}>
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      autoFocus
                      value={contentMessage}
                      onChange={(e) => setContentMessage(e.target.value)}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </form>
          <div className="flex">
            <Button className="" size="sm" variant="outline" onClick={() => setIsEditing(false)}>
              {t("common:cancel")}
            </Button>
            <Button
              className="ml-1"
              type="submit"
              size="sm"
              disabled={form.formState.isSubmitting}
              onClick={() => form.handleSubmit(onEditMessage)()}
            >
              {t("common:save")}
            </Button>
          </div>
        </FormProvider>
      ) : (
        <>
          <MessageBubble variant={message.side === "in" ? "primary" : "secondary"}>
            <MessageBubbleText>{message.content}</MessageBubbleText>
          </MessageBubble>
          {message.side !== "in" && conversationsType === "patients" && isWithinTenMinutes && (
            <EditIcon handlerEditMessage={toggleMessageEditStatus(true)} />
          )}
        </>
      )}
    </>
  );
};
export default MessageContent;
