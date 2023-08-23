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
}
