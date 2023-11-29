export interface INotificationsData {
  unread: number;
  notifications: ICurrentNotifitions;
}
interface ICurrentNotifitions {
  current_page: number | null;
  data: INotifications[];
  first_page_url: string | null;
  from: number | null;
  last_page: number | null;
  last_page_url: string | null;
  links: ILinks[];
  next_page_url: string | null;
  path: string | null;
  per_page: number | null;
  prev_page_url?: string | null;
  to: number | null;
  total: number | null;
}
export interface INotifications {
  id: number;
  type:
    | "new_ticket"
    | "new_topup"
    | "new_referral"
    | "new_referral_revenue"
    | "new_review"
    | "chat_archived"
    | "reset_password"
    | "invite_to_chat"
    | "info"
    | "info_with_link"
    | "note";
  user_id: number;
  data: {
    user_name: string;
  };
  read_at: string | number | null;
  created_at: string | null;
  updated_at: string | null;
  like?: number;
  isMeet?: number;
  amount?: string;
  currency?: string;
}
interface ILinks {
  url: string | null;
  label: string | null;
  active: boolean;
}
