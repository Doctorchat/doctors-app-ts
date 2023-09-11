import { TWeekDays } from "@/features/auth";
import { Moment } from "moment";

type Disponibility = {
  [key in TWeekDays]: [string | null | Moment, string | null | Moment];
};

export type SetDisponibilityPayload = {
  time_frame: number;
  time_buffer: number;
} & Disponibility;