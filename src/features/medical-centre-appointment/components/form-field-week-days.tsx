import { UseFormReturn } from "react-hook-form";
import React from "react";
import { useTranslation } from "react-i18next";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui";
import { daysWeek } from "@/utils/date.ts";
import dayjs, { Dayjs } from "dayjs";
import { TimePicker } from "antd";

interface FormFieldWeekDaysProps {
  form: UseFormReturn<any>;
  loading?: boolean;
}

const format = "HH:mm";

export const FormFieldWeekDays: React.FC<FormFieldWeekDaysProps> = (props) => {
  const { form, loading } = props;
  const { t } = useTranslation();

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
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>{t(`common:days_week.${day?.slice(0, 3)}`)}</FormLabel>

                <FormControl>
                  <TimePicker.RangePicker
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
