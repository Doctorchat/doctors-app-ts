import { useEffect, useState } from "react";
import Calendar from "@/components/ui/calendar";
import { CalendarProps } from "../types";
import {
  extractDaysFromAppointments,
  findAppointmentsByDate,
  parseTimeFromDateTime,
} from "../utils/getDates";
import { cn } from "@/utils";
import { Card } from "@/components/ui/card";
import { HiVideoCamera } from "react-icons/hi";
import classNames from "classnames";
import { useTranslation } from "react-i18next";

const CustomRender: React.FC<CalendarProps> = ({ loading, data }) => {
  const initialValue = new Date() ? new Date() : null;
  const [value, setValue] = useState<Date | null>(initialValue);
  const [scheduleOfDay, setSchedule] = useState<any>();
  useEffect(() => {
    setSchedule(findAppointmentsByDate(new Date(), data));
  }, [loading, data]);

  const extractedDays = extractDaysFromAppointments(data);
  const onChangeDates = (date: Date) => {
    setValue(date);
    const schedule = findAppointmentsByDate(date, data);
    setSchedule(schedule);
  };
  const { t } = useTranslation();
  return (
    <div className="py-2">
      <Card className={cn("p-5")}>
        <Calendar
          value={value}
          dayClassName={(date, { selected }) =>
            selected ? "text-white" : "text-gray-700 dark:text-gray-200"
          }
          dayStyle={(date, { outOfMonth }) => {
            if (outOfMonth) {
              return {
                opacity: 0,
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
              <span className="relative flex h-full w-full items-center justify-center">
                {day}
                <span className="badge-dot absolute bottom-1 !h-1 !w-1" />
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

export default CustomRender;
