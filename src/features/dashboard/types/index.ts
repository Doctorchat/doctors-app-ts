import {
  ConversationDoctors,
  ConversationPreview,
  LastMessageDc,
} from "@/features/conversations/types";

export interface IReferral {
  partner_url: null | number | string | object;
  partner_qr: null | number | string | object;
  percent: number;
  earned: number;
  currency: string;
  referrals: [
    {
      id: number;
      name: string;
      email: string;
      phone: string;
      created_at: string;
    }
  ];
  transactions: {
    current_page: number;
    data: [
      {
        id: number;
        amount: string;
        created_at: string;
      },
      {
        id: number;
        amount: number;
        created_at: string;
      }
    ];
    first_page_url: null | number | string | object;
    from: number;
    last_page: number;
    last_page_url: null | number | string | object;
    links: [
      {
        url: null | number | string | object;
        label: string;
        active: boolean;
      },
      {
        url: null | number | string | object;
        label: string;
        active: boolean;
      },
      {
        url: null | number | string | object;
        label: string;
        active: boolean;
      }
    ];
    next_page_url: null | number | string | object;
    path: null | number | string | object;
    per_page: number;
    prev_page_url: null | number | string | object;
    to: number;
    total: number;
  };
}
export interface IReviews {
  total: number;
  likes: number;
  dislikes: number;
}
export interface IWallet {
  id: number;
  balance: number;
  frozen: number;
  earned: number;
  currency: string;
}

export interface IReservations {
  id: number;
  status: string;
  chat_id: number;
  user_id: number;
  card_id: null | number | string | object;
  doctor_id: number;
  payment_id: null | number | string | object;
  start_time: string;
  end_time: string;
  expired_at: null | number | string | object;
  created_at: string;
  updated_at: string;
  user_notified: number;
  doctor_notified: number;
  doctor_notified_in_one_day: number;
  user_notified_in_one_day: number;
}
export interface IChats {
  openCount: number;
  doctorCount: number;
  closedCount: number;
  doctor: ConversationDoctors[];
  open: IChatCloseOrOpen[];
  closed: IChatCloseOrOpen[];
}
export interface IChatCloseOrOpen {
  id: number;
  avatar: string | null;
  name: string;
  updated: string;
  type: string;
  description: string;
  unread: number;
  user_id: number;
  status: number;
  isMeet: boolean;
  isOnline: boolean;
  isAnonym: boolean;
  company_id: null | string | number;
  title?: string;
  updated_at?: string;
  lastMessage?: LastMessageDc;
  unreadCount?: number;
  isAccepted?: boolean;
}
export interface StatisticsDashboard {
  avatar: string | null;
  wallet: IWallet;
  referral: IReferral;
  reviews: IReviews;
  reservations: IReservations[];
  chats: IChats;
  SuccessfullyClosedChats: any;
}

export interface ChatsProps {
  loading?: boolean;
  typeChat: string;
  data?: IChatCloseOrOpen[] | ConversationDoctors[] | ConversationPreview[];
}

export interface TabsProps {
  loading?: boolean;
  data?: IChats;
}
export interface ChartsLineProps {
  loading?: boolean;
  data?: any;
}
export interface ChartDonutProps {
  loading?: boolean;
  data?: IReviews;
}
export interface CalendarProps {
  loading?: boolean;
  data?: ICalendar[];
  setMonth?: any;
}
export interface CardProps {
  loading?: boolean;
  data?: IWallet;
  image?: null | string;
}
export interface ICalendar {
  chat_id: number;
  end_time: string;
  name: string;
  start_time: string;
  status: string;
  type: string;
}
export interface IReservationsCalendar {
  reservations: ICalendar[];
}
