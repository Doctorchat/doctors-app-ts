import { useEffect, useState } from "react";
import Calendar from "@/components/ui/calendar";
import { CalendarProps } from "../types";
import {
  extractDaysFromAppointments,
  findAppointmentsByDate,
  getCurrentMonth,
  parseTimeFromDateTime,
} from "../utils/getDates";
import { cn } from "@/utils";
import { Card } from "@/components/ui/card";
import { HiVideoCamera } from "react-icons/hi";
import classNames from "classnames";
import { useTranslation } from "react-i18next";
import { Skeleton } from "@/components/ui";

const CalendarFallback = () => {
  const { t } = useTranslation();
  return (
    <div className="py-2">
      <Card className={cn("p-5")}>
        <div className="flex-column flex gap-1">
          <Skeleton className="h-36 w-full" />
        </div>
        <hr className="my-6" />
        <h5 className="mb-4 font-bold">{t("conversations:schedule")}</h5>
        <div className="flex-column flex gap-1">
          <Skeleton className="h-20 w-full" />
        </div>
      </Card>
    </div>
  );
};

const CalendarReservations: React.FC<CalendarProps> = ({ loading, data = [], setMonth }) => {
  const { t } = useTranslation();
  const initialValue = new Date() ? new Date() : null;
  const [value, setValue] = useState<Date | null>(initialValue);
  const [scheduleOfDay, setSchedule] = useState<any>();
  const extractedDays = extractDaysFromAppointments(data);
  const onChangeDates = (date: Date) => {
    setValue(date);
    const schedule = findAppointmentsByDate(date, data);
    setSchedule(schedule);
  };
  const onChangeMonth = (date: Date) => {
    const monthSelected = getCurrentMonth(date);
    setMonth(monthSelected);
  };
  useEffect(() => {
    setSchedule(findAppointmentsByDate(new Date(), data));
  }, []);
  if (loading) {
    return <CalendarFallback />;
  }
  return (
    <div className="py-2" key="calendar-reservation">
      <Card className={cn("p-5")} key="card-calendar">
        <Calendar
          key="calendar"
          onMonthChange={onChangeMonth}
          value={value}
          dayClassName={(date, { selected }) =>
            (selected ? "text-white" : "text-gray-700 dark:text-gray-200") &&
            (extractedDays.includes(date.getDate())
              ? " bg-color-date-blue rounded-lg text-white"
              : "")
          }
          dayStyle={(date, { outOfMonth }) => {
            if (outOfMonth) {
              return {
                opacity: 0.5,
                pointerEvents: "none",
                cursor: "default",
              };
            }

            return {};
          }}
          renderDay={(date) => {
            const day = date.getDate();

            if (!extractedDays.includes(day)) {
              return <span>{day}</span>;
            }

            return (
              <span className="relative flex h-full w-full items-center justify-center text-white">
                {day}
              </span>
            );
          }}
          onChange={onChangeDates}
        />
        <hr className="my-6" />
        <h5 className="mb-4 font-bold">{t("conversations:schedule")}</h5>
        {!scheduleOfDay?.length && (
          <div className="user-select mb-2 flex cursor-pointer items-center justify-between rounded-md p-2 hover:bg-gray-50 dark:hover:bg-gray-600/40">
            <div className="flex justify-center	">{t("conversations:no_schedule")}</div>
            <div className="flex items-center gap-3"></div>
          </div>
        )}
        {scheduleOfDay?.map((event: any) => (
          <div
            key={event.id}
            className="user-select mb-2 flex cursor-pointer items-center justify-between rounded-md p-2 hover:bg-gray-50 dark:hover:bg-gray-600/40"
          >
            <div className="flex items-center gap-3">
              <div
                className={classNames(
                  "flex h-10 w-10 items-center justify-center rounded-lg text-lg",
                  "bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-100"
                )}
              >
                <HiVideoCamera />
              </div>
              <div>
                <h6 className="text-sm font-bold">{t("conversations:consultation")}</h6>
                <p>{t("conversations:consultation_video")}</p>
              </div>
            </div>
            <span>{parseTimeFromDateTime(event.start_time)}</span>
          </div>
        ))}
      </Card>
    </div>
  );
};
export default CalendarReservations;
