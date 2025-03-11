import { UseFormReturn } from "react-hook-form";
import React, { lazy, Suspense, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Skeleton,
} from "@/components/ui";
import { daysWeek } from "@/utils/date.ts";
import dayjs, { Dayjs } from "dayjs";
import { IMedicalCentreData } from "@/features/medical-centre-appointment/types";

const TimePicker = lazy(() =>
  import("antd").then((module) => ({ default: module.TimePicker.RangePicker }))
);

interface FormFieldWeekDaysProps {
  form: UseFormReturn<any>;
  loading?: boolean;
  data: IMedicalCentreData;
}

const format = "HH:mm";

export const FormFieldWeekDays: React.FC<FormFieldWeekDaysProps> = (props) => {
  const { form, loading, data } = props;
  const { t } = useTranslation();

  const handleTimeChange = (day: string, value: [Dayjs | null, Dayjs | null] | null) => {
    const from = value?.[0] ? value[0].format(format) : null;
    const to = value?.[1] ? value[1].format(format) : null;
    form.setValue(day, { from, to });
  };

  useEffect(() => {
    if (form.getValues()) {
      form.reset({
        // @ts-ignore
        ...Object.fromEntries(daysWeek.map((day) => [day, data[day]])),
      });
    }
  }, [form.getValues()]);

  return (
    <>
      {daysWeek.map((day, index) => (
        <FormField
          key={index}
          control={form.control}
          name={day}
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>{t(`common:days_week.${day?.slice(0, 3)}`)}</FormLabel>

                <FormControl>
                  <Suspense fallback={<Skeleton className="h-8 w-full py-2" />}>
                    <TimePicker
                      className="w-full py-2"
                      placeholder={[t("common:start_time"), t("common:end_time")]}
                      disabled={loading}
                      format={format}
                      onChange={(value) => handleTimeChange(day, value)}
                      value={
                        field.value?.from && field.value?.to
                          ? [
                              dayjs(field.value.from, format).isValid()
                                ? dayjs(field.value.from, format)
                                : null,
                              dayjs(field.value.to, format).isValid()
                                ? dayjs(field.value.to, format)
                                : null,
                            ]
                          : null
                      }
                      minuteStep={5}
                    />
                  </Suspense>
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
      ))}
    </>
  );
};
