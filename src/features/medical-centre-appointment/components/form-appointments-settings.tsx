"use client";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { FormProvider, useForm } from "react-hook-form";
import { Checkbox } from "antd";
import { z } from "zod";

import { cn } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateDisponibilityByMedicalCentreId } from "../api";
import {
  Button,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@/components/ui";
import Notification from "@/components/ui/notification";

import { IMedicalCentreData } from "@/features/medical-centre-appointment/types";
import { FormFieldWeekDays } from "@/features/medical-centre-appointment/components/form-field-week-days";
import { daysWeek } from "@/utils/date";
import { useMedicalCentreList } from "@/features/medical-centre-appointment/hooks";

interface IProps {
  data: IMedicalCentreData;
}

const daySchema = z
  .object({
    from: z.string().nullable(),
    to: z.string().nullable(),
  })
  .nullable();

const schema = z.object({
  duration: z
    .union([z.string(), z.number()])
    .nullable()
    .transform((value) => (value ? Number(value) : 0)),
  buffer: z
    .union([z.string(), z.number()])
    .nullable()
    .transform((value) => (value ? Number(value) : 0)),
  auto_regenerate: z.boolean(),
  ...Object.fromEntries(daysWeek.map((day) => [day, daySchema])),
});

type FormValues = z.infer<typeof schema>;

export const FormAppointmentsSettings: React.FC<IProps> = ({ data }) => {
  const { refetchMedicalCentre } = useMedicalCentreList();
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const form = useForm<FormValues>({
    defaultValues: {
      duration: data?.duration || 0,
      buffer: data?.buffer || 0,
      auto_regenerate: Boolean(data?.auto_regenerate),
      // @ts-ignore
      ...Object.fromEntries(daysWeek.map((day) => [day, data[day]])),
    },
    resolver: zodResolver(schema),
  });

  const onSubmitTestIsSubmitting = async (values: any) => {
    setLoading(true);
    try {
      const { duration, ...rest } = values;
      await updateDisponibilityByMedicalCentreId({
        id: data?.id,
        duration: duration === 0 ? null : duration,
        ...rest,
      });

      setApiResponse({ type: "success", message: t("common:success_update") });
      await refetchMedicalCentre();
    } catch (error) {
      console.log(error);
      setApiResponse({ type: "error", message: t("common:error_update") });
    } finally {
      setLoading(false);
    }
  };

  const setOnOpenChange = (val: { type: "error" | "success"; message: string } | null) => () =>
    setApiResponse(val);

  return (
    <>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmitTestIsSubmitting)}>
          <Notification
            open={Boolean(apiResponse)}
            onOpenChange={setOnOpenChange(null)}
            type={apiResponse?.type}
            description={
              apiResponse?.type === "success"
                ? t("common:success_update")
                : t("common:error_update")
            }
          />

          <div className={cn("flex flex-col gap-4")}>
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("video:consultation_duration")}</FormLabel>
                  <FormControl>
                    <Input type="number" className="w-full" disabled={loading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="buffer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("video:consultation_interval")}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      className="w-full px-2 py-4"
                      disabled={loading}
                      min={0}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormFieldWeekDays form={form} loading={loading} />
          </div>

          <div className={cn("flex items-center justify-between gap-4")}>
            <FormField
              control={form.control}
              name="auto_regenerate"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onChange={(checked) => field.onChange(checked)}
                      className="!mt-0"
                      {...(field as any)}
                    />
                  </FormControl>
                  <FormLabel>{t("medical_centre:auto_regenerate")}</FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={loading}
              className="mt-4 w-60 bg-primary px-2 py-1 text-sm hover:bg-primary-hover xs:hover:bg-primary-hover sm:hover:bg-primary-hover md:hover:bg-primary-hover"
            >
              {t("common:save")}
              {loading && "..."}
            </Button>
          </div>
        </form>
      </FormProvider>
    </>
  );
};
