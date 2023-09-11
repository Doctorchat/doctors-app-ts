import { TWeekDays } from "@/features/auth";
import { Moment } from "moment";

type Disponibility = {
  [key in TWeekDays]: [string | null | Moment, string | null | Moment];
};

export type SetDisponibilityPayload = {
  time_frame: number;
  time_buffer: number;
} & Disponibility;

export type Appointment = {
  card_id: null | string;
  chat_id: number;
  created_at: string;
  doctor_id: number;
  doctor_notified: number;
  doctor_notified_in_one_day: number;
  end_time: string;
  expired_at: null | string;
  id: number;
  payment_id: null | string;
  start_time: string;
  status: string;
  updated_at: string;
  user_id: number;
  user_notified: number;
  user_notified_in_one_day: number;
};
