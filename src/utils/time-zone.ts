import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);

export const calculateDateTimeInTimeZone = (
  dateTime: string | number | dayjs.Dayjs | Date | null | undefined
) => {
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const dayjsDateTime = dayjs(dateTime).utc().tz(userTimeZone);
  return dayjsDateTime.format("YYYY-MM-DD HH:mm:ss");
};
