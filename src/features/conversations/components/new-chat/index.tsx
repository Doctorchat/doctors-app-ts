import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  Input,
} from "@/components/ui";
import { t } from "i18next";
import { FormProvider, useForm } from "react-hook-form";
import { shallow } from "zustand/shallow";
import { createWithEqualityFn } from "zustand/traditional";

import React from "react";
import Select from "@/components/ui/SelectElstar";
import { toast } from "@/hooks";
import { useQuery, useQueryClient } from "react-query";
import { apiCreateNewChat, apiReceiveDoctorsList } from "../../api";
import { CustomControlMulti, CustomSelectOption } from "./custom-select";
import { getApiErrorMessages } from "@/utils";
import Notification from "@/components/ui/notification";

interface NewChatStore {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const useNewChatDoctors = createWithEqualityFn<NewChatStore>(
  (set) => ({
    open: false,
    setOpen: (open) => set({ open }),
  }),
  shallow
);

export const AddChatDoctors: React.FC = () => {
  const [openNotification, setOpenNotification] = React.useState(false);
  const setOnOpenChange = (val: { type: "error" | "success"; message: string } | null) => () =>
    setOpenNotification(!!val);
  const open = useNewChatDoctors((state) => state.open);
  const setOpen = useNewChatDoctors((state) => state.setOpen);
  const sessionUser = localStorage.getItem("session:user") ?? "";
  const user = !!sessionUser ? JSON.parse(localStorage.getItem("session:user") || "") : "";
  const { data: doctorsList } = useQuery({
    queryKey: ["doctorsList"],
    queryFn: async () => {
      return apiReceiveDoctorsList(user?.id);
    },
  });

  const form = useForm<any>({});
  const queryClient = useQueryClient();
  const [isSending, setIsSending] = React.useState(false);
  const onCreateChat = async () => {
    if (nameChat && idsDoctors?.length) {
      setIsSending(true);
      try {
        await apiCreateNewChat({
          title: nameChat,
          doctorIds: idsDoctors,
        });
        setOpenNotification(true);
        setTimeout(() => {
          setOpenNotification(false);
        }, 3000);

        setTimeout(() => {
          queryClient.invalidateQueries(["list-doctors", "doctors"]);
        }, 300);
        setOpen(false);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "common:something_went_wrong",
          description: getApiErrorMessages(error),
        });
        setOpen(false);
      } finally {
        setIsSending(false);
      }
    }
  };
  const options = doctorsList?.map((item: any) => ({
    value: item.id,
    label: item.name,
    avatar: item.avatar,
    seen: item.last_seen,
    updated: item.updated_at,
  }));
  const [idsDoctors, setIdsDoctors] = React.useState<number[] | null>(null);
  const [nameChat, setNameChat] = React.useState<string | null>("");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        onEscapeKeyDown={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
        className="max-w-md"
      >
        <DialogHeader>
          <DialogTitle>{t("conversations:new_chat_doctors.title")}</DialogTitle>
        </DialogHeader>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onCreateChat)}>
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="chatName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("conversations:new_chat_doctors.input.description")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("conversations:new_chat_doctors.input.placeholder")}
                        onChange={(e) => setNameChat(e.target.value)}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="selectDoctors"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("conversations:new_chat_doctors.select.description")}</FormLabel>
                    <FormControl>
                      <Select
                        isMulti
                        placeholder={t("conversations:new_chat_doctors.select.placeholder")}
                        options={options}
                        components={{
                          Option: CustomSelectOption,
                          MultiValueLabel: CustomControlMulti,
                        }}
                        className="mb-4"
                        onChange={(values: any) => {
                          setIdsDoctors(values.flatMap((item: { value: any }) => item.value));
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </form>
        </FormProvider>
        <DialogFooter>
          <Button variant="outline" disabled={isSending} onClick={() => setOpen(false)}>
            {t("common:cancel")}
          </Button>
          <Button
            variant="primary"
            disabled={isSending || !nameChat || !idsDoctors?.length}
            onClick={() => form.handleSubmit(onCreateChat)()}
          >
            {t("conversations:new_chat_doctors.create_button")}
          </Button>
        </DialogFooter>
      </DialogContent>
      <Notification
        onOpenChange={setOnOpenChange(null)}
        open={openNotification ? true : false}
        type={"success"}
        description={t("common:on_succes_notification")}
      />
    </Dialog>
  );
};
