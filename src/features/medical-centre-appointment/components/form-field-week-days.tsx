import { UseFormReturn } from "react-hook-form";
import React, { lazy, Suspense } from "react";
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

const TimePicker = lazy(() =>
  import("antd").then((module) => ({ default: module.TimePicker.RangePicker }))
);

interface FormFieldWeekDaysProps {
  form: UseFormReturn<any>;
  loading?: boolean;
}

export const FormFieldWeekDays: React.FC<FormFieldWeekDaysProps> = (props) => {
  const { form, loading } = props;
  const { t } = useTranslation();
  const format = "HH:mm";

  const handleTimeChange = (day: string, value: [Dayjs | null, Dayjs | null] | null) => {
    const from = value?.[0] ? value[0].format(format) : null;
    const to = value?.[1] ? value[1].format(format) : null;
    form.setValue(day, { from, to });
  };

  return (
    <>
      {daysWeek.map((day, index) => (
        <FormField
          key={index}
          control={form.control}
          name={day}
          render={({ field }) => (
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
                        ? [dayjs(field.value.from, format), dayjs(field.value.to, format)]
                        : null
                    }
                    minuteStep={5}
                  />
                </Suspense>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ))}
    </>
  );
};
