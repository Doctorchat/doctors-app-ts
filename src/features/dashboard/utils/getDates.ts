import { IReservations } from "../types";

const extractDayFromDate = (dateString: string): number => {
  const date = new Date(dateString);
  const day = date.getDate();
  return day;
};

export const extractDaysFromAppointments = (data: IReservations[] = []): number[] => {
  const days: number[] = [];

  for (const appointment of data) {
    const day = extractDayFromDate(appointment.start_time);
    if (!days.includes(day)) {
      days.push(day);
    }
  }

  return days;
};

export const findAppointmentsByDate = (date: any, data: IReservations[] = []): IReservations[] => {
  const inputDateObj = new Date(date);
  const matchingAppointments: IReservations[] = [];
  for (const appointment of data) {
    const appointmentDate = appointment.start_time.substr(0, 10); // Extrage doar partea de dată a start_time
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
