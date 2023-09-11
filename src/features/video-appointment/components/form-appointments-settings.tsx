import React, { Suspense, lazy } from 'react';
import { useTranslation } from "react-i18next";
import { cn } from "@/utils";
import { FormProvider, UseFormReturn, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { TWeekDays, useAuth } from "@/features/auth";
import { setDisponibility } from "../api/index";

import {
  Button,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Skeleton,
} from "@/components/ui";
import Notification from "@/components/ui/notification";
import { parse } from 'date-fns';
import moment from 'moment';


const TimePicker = lazy(() => import('antd').then(module => ({ default: module.TimePicker.RangePicker })));
const daysWeek = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as TWeekDays[];

const FormAppointmentsSettings: React.FC = () => {
  const { t } = useTranslation();
  const { session, revalidateSession } = useAuth();

  const [apiResponse, setApiResponse] = React.useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [timeoutId, setTimeoutId] = React.useState<number | null>(null);
  const [loading, setLoading] = React.useState(false);

  const isMoment = (value: any): value is moment.Moment => moment.isMoment(value);
  const daySchema = z.array(
    z.union([
      z.null(),
      z.any().refine(isMoment, {
        message: "Must be a Moment object",
      }),
    ])
  );

  const timeSchema = (min: number, max: number) => z.string().refine((value: any) => parseInt(value, 10) >= min && parseInt(value, 10) <= max, {
    message: t("common:zod_number_range", { min, max }),
  });

  const daysSchema: Record<string, typeof daySchema> = daysWeek.reduce(
    (acc, day) => {
      acc[day] = daySchema;
      return acc;
    },
    {} as Record<string, typeof daySchema>
  );

  const schema = z.object({
    time_frame: timeSchema(1, 120),
    time_buffer: timeSchema(1, 60),
    ...daysSchema
  });

  type FormValues = z.infer<typeof schema>;

  const stringTimeToMoment = (time: string | null): moment.Moment | null => {
    if (!time) return null;
    const date = parse(time, 'HH:mm', new Date());
    return moment(date);
  };


  const defaultDayTime = (day: TWeekDays): [moment.Moment | null, moment.Moment | null] => {
    const disponibility: any = session?.user?.disponibility || {};
    return [
      stringTimeToMoment(disponibility[day]?.[0]),
      stringTimeToMoment(disponibility[day]?.[1])
    ];
  };

  const defaultValuesDays: Record<TWeekDays, [moment.Moment | null, moment.Moment | null]> = daysWeek.reduce(
    (acc, day) => {
      acc[day] = defaultDayTime(day);
      return acc;
    },
    {} as Record<TWeekDays, [moment.Moment | null, moment.Moment | null]>
  );

  const form = useForm<FormValues>({
    defaultValues: {
      time_frame: `${session?.user?.["time_frame"]}` || "",
      time_buffer: `${session?.user?.["time_buffer"]}` || "",
      ...defaultValuesDays,
    },
    resolver: zodResolver(schema),
  });

  const onSubmitTestIsSubmitting = (values: any) => {
    setLoading(true);
    console.log(values);
    setDisponibility({
      time_frame: parseInt(values.time_frame, 10),
      time_buffer: parseInt(values.time_buffer, 10),
      mon: [values.mon[0]?.format("HH:mm"), values.mon[1]?.format("HH:mm")],
      tue: [values.tue[0]?.format("HH:mm"), values.tue[1]?.format("HH:mm")],
      wed: [values.wed[0]?.format("HH:mm"), values.wed[1]?.format("HH:mm")],
      thu: [values.thu[0]?.format("HH:mm"), values.thu[1]?.format("HH:mm")],
      fri: [values.fri[0]?.format("HH:mm"), values.fri[1]?.format("HH:mm")],
      sat: [values.sat[0]?.format("HH:mm"), values.sat[1]?.format("HH:mm")],
      sun: [values.sun[0]?.format("HH:mm"), values.sun[1]?.format("HH:mm")],
    })
      .then(() => {
        setApiResponse({ type: "success", message: t("common:success_update") });
        revalidateSession();
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

  const setOnOpenChange = (val: { type: "error" | "success"; message: string } | null) => () => setApiResponse(val);

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmitTestIsSubmitting)}
      >
        <Notification
          open={apiResponse ? true : false}
          onOpenChange={setOnOpenChange(null)}
          type={apiResponse?.type}
          description={apiResponse?.type === "success" ? t("common:success_update") : t("common:error_update")}
        />
        <div className={cn("flex flex-col gap-4")}>
          <FormField
            control={form.control}
            name="time_frame"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("consultation:repeated_consultations.duration")}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    className="w-full"
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="time_buffer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("consultation:repeated_consultations.discount")}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    className="w-full px-2 py-4"
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormFieldWeekDays
            form={form}
            loading={loading}
          />
        </div>
        <div
          className={cn(
            "flex justify-end",
          )}
        >
          <Button
            type="submit"
            disabled={loading}
            className="w-60 mt-4 text-sm bg-primary hover:bg-primary-hover xs:hover:bg-primary-hover sm:hover:bg-primary-hover md:hover:bg-primary-hover px-2 py-1"
          >
            {t("common:save")}
            {loading && "..."}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

interface FormFieldWeekDaysProps {
  form: UseFormReturn<any>;
  loading?: boolean;
};

const FormFieldWeekDays: React.FC<FormFieldWeekDaysProps> = (props) => {
  const { form, loading } = props;
  const { t } = useTranslation();
  const format = 'HH:mm';

  return (
    <>
      {daysWeek.map((day, index) => (
        <FormField
          key={index}
          control={form.control}
          name={day}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t(`common:days_week.${day}`)}</FormLabel>
              <FormControl>
                <Suspense fallback={(
                  <Skeleton className="w-full py-2 h-8" />
                )}>
                  <TimePicker
                    className="w-full py-2"
                    placeholder={[t("common:start_time"), t("common:end_time")]}
                    okText={t("common:save")}
                    disabled={loading}
                    format={format}
                    {...field as any}
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

export default FormAppointmentsSettings;