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
  created_at: string;
  updated_at: string;
  like?: number;
  isMeet?: number;
  amount?: string;
  currency?: string;
  chat_id?: string;
  content?: string | null;
  link?: string | null;
}
interface ILinks {
  url: string | null;
  label: string | null;
  active: boolean;
}
export interface ITypesOfButton {
  new_ticket: boolean;
  new_referral: boolean;
  new_referral_revenue: boolean;
  new_review: boolean;
  chat_archived: boolean;
  reset_password: boolean;
  invite_to_chat: boolean;
  info: boolean;
  info_with_link: boolean;
  note: boolean;
}

// Tipizează obiectul isButtonNotification
export type ButtonNotification = {
  new_ticket: boolean;
  new_referral_revenue: boolean;
  new_referral: boolean;
  new_review: boolean;
  chat_archived: boolean;
  reset_password: boolean;
  invite_to_chat: boolean;
  info: boolean;
  info_with_link: boolean;
  note: boolean;
};
type ILinksNotifications = { isButton: boolean; isPartialLink: boolean; link: string };
// Tipizează obiectul isLinkNotification
export type LinkNotification = {
  new_ticket?: ILinksNotifications;
  new_review?: ILinksNotifications;
  chat_archived?: ILinksNotifications;
  invite_to_chat?: ILinksNotifications;
  info_with_link?: ILinksNotifications;
  new_referral_revenue?: ILinksNotifications;
  new_referral?: ILinksNotifications;
  reset_password?: ILinksNotifications;
  note?: ILinksNotifications;
  info?: ILinksNotifications;
};
