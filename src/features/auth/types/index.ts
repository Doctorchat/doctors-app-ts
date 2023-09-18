export type TWeekDays = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

export interface SessionUser {
  id: number;
  avatar: string;
  name: string;
  phone: string;
  email: string;
  locale: string;
  offer_discount?: boolean;
  discount_days?: number;
  discount?: number;
  "g-auth"?: boolean;
  time_buffer: number | null;
  time_frame: number | null;
  disponibility?: {
    [key in TWeekDays]: string[];
  };
  consultation_auto_renew?: boolean;
}
