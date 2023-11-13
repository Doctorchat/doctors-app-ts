import React, { Suspense, lazy } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/utils";
import { FormProvider, UseFormReturn, useForm } from "react-hook-form";
import { boolean, z } from "zod";
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
import { parse } from "date-fns";
import moment from "moment";
import { Checkbox } from "antd";

const TimePicker = lazy(() =>
  import("antd").then((module) => ({ default: module.TimePicker.RangePicker }))
);
const daysWeek = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as TWeekDays[];

const FormAppointmentsSettings: React.FC = () => {
  const { t } = useTranslation();
  const { session, revalidateSession } = useAuth();

  const [apiResponse, setApiResponse] = React.useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [timeoutId, setTimeoutId] = React.useState<number | null>(null);
  const [loading, setLoading] = React.useState(false);
  const daySchema = z.array(z.any()).nullable();

  const timeSchema = (min: number, max: number) =>
    z.string().refine((value: any) => parseInt(value, 10) >= min && parseInt(value, 10) <= max, {
      message: t("common:zod_number_range", { min, max }),
    });
  const schema = z.object({
    time_frame: timeSchema(1, 120),
    time_buffer: timeSchema(1, 60),
    consultation_auto_renew: boolean(),
    ...Object.fromEntries(daysWeek.map((day) => [day, daySchema.optional()])),
  });

  type FormValues = z.infer<typeof schema>;

  const stringTimeToMoment = (time: string | null): moment.Moment | null => {
    if (!time) return null;
    const date = parse(time, "HH:mm", new Date());
    return moment(date);
  };

  const defaultDayTime = (day: TWeekDays): [moment.Moment | null, moment.Moment | null] => {
    const disponibility: any = session?.user?.disponibility || {};
    return [
      stringTimeToMoment(disponibility[day]?.[0]),
      stringTimeToMoment(disponibility[day]?.[1]),
    ];
  };

  const defaultValuesDays: Record<TWeekDays, [moment.Moment | null, moment.Moment | null]> =
    daysWeek.reduce((acc, day) => {
      acc[day] = defaultDayTime(day);
      return acc;
    }, {} as Record<TWeekDays, [moment.Moment | null, moment.Moment | null]>);

  const form = useForm<FormValues>({
    defaultValues: {
      time_frame: `${session?.user?.["time_frame"]}` || "",
      time_buffer: `${session?.user?.["time_buffer"]}` || "",
      consultation_auto_renew: session?.user?.consultationAutoRenew,
      ...defaultValuesDays,
    },
    resolver: zodResolver(schema),
  });

  const onSubmitTestIsSubmitting = (values: any) => {
    setLoading(true);
    setDisponibility({
      time_frame: parseInt(values.time_frame, 10),
      time_buffer: parseInt(values.time_buffer, 10),
      consultation_auto_renew: values.consultation_auto_renew,
      mon: [
        (values.mon && values.mon[0]?.format("HH:mm")) ?? null,
        (values.mon && values.mon[1]?.format("HH:mm")) ?? null,
      ],
      tue: [
        (values.tue && values.tue[0]?.format("HH:mm")) ?? null,
        (values.tue && values.tue[1]?.format("HH:mm")) ?? null,
      ],
      wed: [
        (values.wed && values.wed[0]?.format("HH:mm")) ?? null,
        (values.wed && values.wed[1]?.format("HH:mm")) ?? null,
      ],
      thu: [
        (values.thu && values.thu[0]?.format("HH:mm")) ?? null,
        (values.thu && values.thu[1]?.format("HH:mm")) ?? null,
      ],
      fri: [
        (values.fri && values.fri[0]?.format("HH:mm")) ?? null,
        (values.fri && values.fri[1]?.format("HH:mm")) ?? null,
      ],
      sat: [
        (values.sat && values.sat[0]?.format("HH:mm")) ?? null,
        (values.sat && values.sat[1]?.format("HH:mm")) ?? null,
      ],
      sun: [
        (values.sun && values.sun[0]?.format("HH:mm")) ?? null,
        (values.sun && values.sun[1]?.format("HH:mm")) ?? null,
      ],
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
            name="time_frame"
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
            name="time_buffer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("video:consultation_interval")}</FormLabel>
                <FormControl>
                  <Input type="number" className="w-full px-2 py-4" disabled={loading} {...field} />
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
            name="consultation_auto_renew"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onChange={(checked: any) => field.onChange(checked)}
                    className="!mt-0"
                    {...(field as any)}
                  />
                </FormControl>
                <FormLabel>{t("video:automatic_confirmation")}</FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />
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

interface FormFieldWeekDaysProps {
  form: UseFormReturn<any>;
  loading?: boolean;
}

const FormFieldWeekDays: React.FC<FormFieldWeekDaysProps> = (props) => {
  const { form, loading } = props;
  const { t } = useTranslation();
  const format = "HH:mm";

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
                <Suspense fallback={<Skeleton className="h-8 w-full py-2" />}>
                  <TimePicker
                    className="w-full py-2"
                    placeholder={[t("common:start_time"), t("common:end_time")]}
                    okText={t("common:save")}
                    disabled={loading}
                    format={format}
                    {...(field as any)}
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
