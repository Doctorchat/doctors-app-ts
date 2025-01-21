import { TWeekDays } from "@/features/auth";
import { Moment } from "moment";

type Disponibility = {
  [key in TWeekDays]: [string | null | Moment, string | null | Moment];
};

export type SetDisponibilityPayload = {
  time_frame: number;
  time_buffer: number;
  consultation_auto_renew: boolean;
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

export interface IMedicalCentre {}

type Logo = {
  id: number;
  name: string;
  extension: string;
  mime_type: string;
  size: number;
  url: string;
};

type Schedule = {
  from: string | null;
  to: string | null;
};

type MedicalCentre = {
  id: number;
  name: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  api_token: string | null;
  logo: Logo;
  created_at: string;
  updated_at: string;
};

export interface IMedicalCentreData {
  id: number;
  medical_centre: MedicalCentre;
  duration: number | null;
  buffer: number | null;
  monday: Schedule;
  tuesday: Schedule;
  wednesday: Schedule;
  thursday: Schedule;
  friday: Schedule;
  saturday: Schedule;
  sunday: Schedule;
  auto_regenerate: boolean;
}

export type ApiResponseMedicalCentre = {
  data: IMedicalCentreData[];
};

export type IWeekDay =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";
