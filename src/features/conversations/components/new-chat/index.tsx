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
  Input,
} from "@/components/ui";
import { t } from "i18next";
import { FormProvider, useForm } from "react-hook-form";
import { shallow } from "zustand/shallow";
import { createWithEqualityFn } from "zustand/traditional";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import Select from "@/components/ui/SelectElstar";
import { toast } from "@/hooks";
import { useQuery } from "react-query";
import { apiCreateNewChat, apiReceiveDoctorsList } from "../../api";
import { CustomControlMulti, CustomSelectOption } from "./custom-select";
import { getApiErrorMessages } from "@/utils";

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
  const open = useNewChatDoctors((state) => state.open);
  const setOpen = useNewChatDoctors((state) => state.setOpen);
  const user = JSON.parse(localStorage.getItem("session:user") || "");
  const { data: doctorsList, isLoading } = useQuery({
    queryKey: ["doctorsList"],
    queryFn: async () => {
      return apiReceiveDoctorsList(user?.id);
    },
  });

  const form = useForm<any>({});
  const [isSending, setIsSending] = React.useState(false);
  const onCreateChat = async () => {
    if (nameChat && idsDoctors?.length) {
      setIsSending(true);
      try {
        await apiCreateNewChat({
          title: nameChat,
          doctorIds: idsDoctors,
        });

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
  const SelectMembers = (values: any) => {
    setIdsDoctors(values.flatMap((item: { value: any }) => item.value));
  };

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
            disabled={isSending || !nameChat || !idsDoctors?.length}
            onClick={() => form.handleSubmit(onCreateChat)()}
          >
            {t("conversations:new_chat_doctors.create_button")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
