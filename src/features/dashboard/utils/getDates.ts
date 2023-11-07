import { ICalendar } from "../types";

const extractDayFromDate = (dateString: string): number => {
  const date = new Date(dateString);
  const day = date.getDate();
  return day;
};

export const extractDaysFromAppointments = (data: ICalendar[] = []): number[] => {
  const days: number[] = [];
  for (const appointment of data) {
    const day = extractDayFromDate(appointment.start_time);
    if (!days.includes(day)) {
      days.push(day);
    }
  }

  return days;
};

export const findAppointmentsByDate = (date: any, data: ICalendar[] = []): ICalendar[] => {
  const inputDateObj = new Date(date);
  const matchingAppointments: ICalendar[] = [];
  for (const appointment of data) {
    const appointmentDate = new Date(appointment.start_time)
    const appointmentDateObj = new Date(appointmentDate);
    if (appointmentDateObj.getDate() === inputDateObj.getDate()) {
      matchingAppointments.push(appointment);
    }
  }

  return matchingAppointments;
};
export const parseTimeFromDateTime = (dateTimeString: string): string => {
  const dateObj = new Date(dateTimeString);
  const hours = dateObj.getHours().toString().padStart(2, "0");
  const minutes = dateObj.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};
export const getCurrentMonth = (date = new Date()) => {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${month}-${year}`;
};
