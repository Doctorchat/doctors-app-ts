export type Appointment = {
  id: number;
  status: string;
  chat_id: number | null;
  user_id: number | null;
  card_id: number | null;
  doctor_id: number;
  payment_id: number | null;
  start_time: string;
  end_time: string;
  expired_at: string | null;
  created_at: string;
  updated_at: string;
  user_notified: number;
  doctor_notified: number;
  doctor_notified_in_one_day: number;
  user_notified_in_one_day: number;
};
