import { Button } from "@/components/ui";
import { useTranslation } from "react-i18next";
import { ArchiveBoxXMarkIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { Appointment } from "../types";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

type AppointmentItemProps = {
  isLoading: boolean;
  data: Appointment[];
  title: string;
  completed?: boolean;
};

const AppointmentItem = (props: AppointmentItemProps) => {
  const { isLoading, data, title, completed } = props;
  const { t } = useTranslation();
  console.log(data);
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  // const inputDate = "2023-10-13T08:26:00Z"; // De exemplu, data în format ISO 8601 cu fus orar UTC
  // const parsedDate = dayjs(inputDate).tz(userTimeZone);

  return (
    <div className="py-3">
      <div className="mb-5">
        <h6 className="mb-2 ps-2 font-semibold text-gray-700">{title}</h6>
        <div className="flex flex-col space-y-4">
          {isLoading && (
            <div className="flex h-32 w-full items-center justify-center">
              {t("common:loading")}
            </div>
          )}
          {!data?.length && (
            <div className="mt-8 flex flex-col items-center justify-center">
              <ArchiveBoxXMarkIcon className="h-16 w-16 text-gray-400" />
              <h4 className="text-md mb-2 font-medium text-gray-400">{t("common:empty_list")}</h4>
            </div>
          )}
          {data?.map((appointment: Appointment) => (
            <div
              key={appointment.id}
              className="border-1 hover:bg-mauve3 relative flex items-center justify-between space-x-4 rounded-md px-2 py-1 shadow-[0_2px_10px] shadow-black/10 focus:shadow-[0_0_0_2px]"
            >
              <div className="absolute left-[0px] right-1/2 h-10 w-1 rounded-full bg-green-400" />
              <div className="flex flex-col">
                <span>{t("video:consultation_date")}</span>
                <p>
                  {dayjs(appointment.start_time).tz(userTimeZone).format("YYYY-MM-DD HH:mm:ss")}
                </p>
              </div>
              <div>
                {/* TO DO 
                We change url or conversetion with /conversations?doctorId= or /conversations?patientId=*/}
                <Link to={`/conversations?id=${appointment.chat_id}`}>
                  <Button
                    size="sm"
                    className="xs:hover:bg-primary-hover bg-primary px-3 py-2 hover:bg-primary-hover sm:hover:bg-primary-hover md:hover:bg-primary-hover"
                  >
                    {completed ? t("common:access") : t("common:summary")}
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AppointmentItem;
