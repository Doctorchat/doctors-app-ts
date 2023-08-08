import React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "react-query";
import { z } from "zod";

import { useConversationLayoutStore } from "./layout";
import { apiAcceptConversation, apiRejectConversation } from "../api";
import { useConversation } from "../hooks";

import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Textarea,
} from "@/components/ui";
import { useToast } from "@/hooks";
import { cn, getApiErrorMessages } from "@/utils";

const schema = z.object({
  message: z.string().min(10),
});

type FormValues = z.infer<typeof schema>;

export interface ApprovalRequestProps extends React.HTMLAttributes<HTMLDivElement> {}

export const ApprovalRequest: React.FC<ApprovalRequestProps> = ({ className, ...props }) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { id, conversation } = useConversation();

  const conversationsType = useConversationLayoutStore((store) => store.conversationsType);

  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    defaultValues: {
      message: "",
    },
    resolver: zodResolver(schema),
  });

  const [apiErrors, setApiErrors] = React.useState<string[] | string | null>(null);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = React.useState(false);
  const [isAcceptLoading, setIsAcceptLoading] = React.useState(false);

  const revalidateQueries = async () => {
    await Promise.allSettled([
      queryClient.invalidateQueries(["conversations", conversationsType]),
      queryClient.invalidateQueries(["conversation", id]),
    ]);
  };

  const onAcceptHandler = async () => {
    if (conversation?.id) {
      setIsAcceptLoading(true);
      try {
        await apiAcceptConversation(conversation.id);
        await revalidateQueries();
      } catch (error) {
        toast({
          variant: "destructive",
          title: "common:something_went_wrong",
          description: getApiErrorMessages(error),
        });
      } finally {
        setIsAcceptLoading(false);
      }
    }
  };

  const onRejectHandler = async (values: FormValues) => {
    if (conversation?.id) {
      try {
        await apiRejectConversation(conversation.id, values.message);
        await revalidateQueries();
        setIsRejectDialogOpen(false);
      } catch (error) {
        setApiErrors(getApiErrorMessages(error));
      }
    }
  };

  if (conversation?.isAccepted === false && conversation?.status === "open") {
    return (
      <>
        <div
          className={cn(
            "absolute inset-x-0 bottom-0 w-full rounded-b-lg p-5 text-center",
            "bg-white",
            className,
          )}
          {...props}
        >
          <div className="absolute bottom-full left-0 right-0 h-full bg-gradient-to-t from-white to-transparent" />
          <h3 className="font-semibold text-typography-primary">
            {t("conversations:approval_request.title")}
          </h3>
          <p className="mt-px text-sm text-typography-primary">
            {t("conversations:approval_request.description")}
          </p>
          <div className="mt-4 flex items-center justify-center">
            <Button
              variant="outline"
              disabled={isAcceptLoading}
              onClick={() => setIsRejectDialogOpen(true)}
            >
              {t("common:decline")}
            </Button>
            <Button className="ml-2" disabled={isAcceptLoading} onClick={onAcceptHandler}>
              {t("common:accept")}
              {isAcceptLoading && "..."}
            </Button>
          </div>
        </div>

        <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{t("conversations:approval_request.reject_dialog_title")}</DialogTitle>
              <DialogDescription>
                {t("conversations:approval_request.reject_dialog_description", {
                  name: "John Doe",
                })}
              </DialogDescription>
            </DialogHeader>
            <FormProvider {...form}>
              <form onSubmit={form.handleSubmit(onRejectHandler)}>
                <div className="space-y-6">
                  {apiErrors && (
                    <Alert variant="destructive">
                      <AlertTitle>{t("common:error")}</AlertTitle>
                      <AlertDescription>
                        <p>{t(apiErrors)}</p>
                      </AlertDescription>
                    </Alert>
                  )}

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("common:reason")}</FormLabel>
                        <FormControl>
                          <Textarea
                            minRows={2}
                            maxRows={6}
                            disabled={form.formState.isSubmitting}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </form>
            </FormProvider>
            <DialogFooter>
              <Button
                variant="outline"
                disabled={form.formState.isSubmitting}
                onClick={() => setIsRejectDialogOpen(false)}
              >
                {t("common:cancel")}
              </Button>
              <Button
                disabled={form.formState.isSubmitting}
                onClick={() => form.handleSubmit(onRejectHandler)()}
              >
                {t("common:decline")}
                {form.formState.isSubmitting && "..."}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return null;
};
