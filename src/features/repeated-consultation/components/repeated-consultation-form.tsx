import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/utils";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@/components/ui";
import Select from "@/components/shared/select";
import { updateDiscount } from "@/features/repeated-consultation/api";
import Notification from "@/components/ui/notification";

const RepeatedConsultationForm = () => {
  const { t } = useTranslation();
  const sessionUser = localStorage.getItem("session:user") ?? "";
  const current_user = !!sessionUser ? JSON.parse(localStorage.getItem("session:user") || "") : "";
  const [user, setUser] = React.useState<any>({});
  useEffect(() => {
    if (current_user) setUser(current_user);
  }, []);

  const isValidSelectOption = (value: string) => {
    return ["yes", "no"].includes(value);
  };

  const schema = z.object({
    offer_discount: z.string().refine((value) => isValidSelectOption(value), {
      message: t("common:zod_mixed_required"),
    }),
    discount_days: z
      .string()
      .refine((value: any) => parseInt(value, 10) < Number.MAX_SAFE_INTEGER, {
        message: `${t("common:zod_mixed_required")}${t("common:zod_mixed_number")}`,
      }),
    discount: z
      .string()
      .refine((value: any) => parseInt(value, 10) >= 10 && parseInt(value, 10) <= 50, {
        message: t("common:zod_number_range", { min: 10, max: 50 }),
      }),
  });

  type FormValues = z.infer<typeof schema>;
  interface IUserData {
    offer_discount?: "yes" | "no";
    discount_days?: number;
    discount?: number;
  }
  const [apiResponse, setApiResponse] = React.useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [timeoutId, setTimeoutId] = React.useState<number | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [info, setInfo] = React.useState<IUserData>({});

  React.useEffect(() => {
    if (Object.keys(user).length) {
      const { offer_discount, discount_days, discount } = user;
      const userData: IUserData = {
        offer_discount: offer_discount ? "yes" : "no",
        discount_days,
        discount,
      };
      setInfo(userData);
      form.reset(userData);
    }
  }, [user]);
  const form = useForm<any>({
    defaultValues: info,
    resolver: zodResolver(schema),
  });

  const onSubmitTestIsSubmitting = async (values: any) => {
    user.offer_discount = values.offer_discount === "yes" ? true : false;
    user.discount_days = parseInt(values.discount_days, 10);
    user.discount = parseInt(values.discount, 10);
    localStorage.setItem("session:user", JSON.stringify(user));

    setLoading(true);
    updateDiscount({
      offer_discount: values.offer_discount === "yes" ? true : false,
      discount_days: parseInt(values.discount_days, 10),
      discount: parseInt(values.discount, 10),
    })
      .then(() => {
        setApiResponse({ type: "success", message: t("common:success_update") });
      })
      .catch(() => {
        setApiResponse({ type: "error", message: t("common:error_update") });
      })
      .finally(() => {
        setLoading(false);
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        const id = setTimeout(() => {
          setApiResponse(null);
        }, 2000) as unknown as number;
        setTimeoutId(id);
      });
  };

  const setOnOpenChange = (val: { type: "error" | "success"; message: string } | null) => () =>
    setApiResponse(val);

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmitTestIsSubmitting)}>
        <Notification
          open={apiResponse ? true : false}
          onOpenChange={setOnOpenChange(null)}
          type={apiResponse?.type}
          description={
            apiResponse?.type === "success" ? t("common:success_update") : t("common:error_update")
          }
        />
        <div className={cn("flex flex-col gap-4")}>
          <FormField
            control={form.control}
            name="offer_discount"
            render={({ field }) => (
              <FormItem>
                <Select
                  value={field.value}
                  disabled={loading}
                  options={[
                    { value: "yes", label: t("common:yes") },
                    { value: "no", label: t("common:no") },
                  ]}
                  onChange={field.onChange}
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="discount_days"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("consultation:repeated_consultations.duration")}</FormLabel>
                <Input
                  type="number"
                  className="w-full"
                  disabled={loading}
                  value={field.value}
                  onChange={field.onChange}
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="discount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("consultation:repeated_consultations.discount")}</FormLabel>
                <Input
                  type="number"
                  className="w-full px-2 py-4"
                  disabled={loading}
                  value={field.value}
                  onChange={field.onChange}
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className={cn("flex justify-end")}>
          <Button
            type="submit"
            disabled={loading}
            className="xs:hover:bg-primary-hover mt-4 w-60 bg-primary px-2 py-1 text-sm hover:bg-primary-hover sm:hover:bg-primary-hover md:hover:bg-primary-hover"
          >
            {t("common:save")}
            {loading && "..."}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default RepeatedConsultationForm;
