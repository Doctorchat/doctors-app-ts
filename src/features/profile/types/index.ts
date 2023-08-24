export interface IUser {
  id: number;
  company_id: number | null;
  referrer_id: number | null;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  locale: string;
  role: number;
  email_verified_at: string | null;
  timezone: string | null;
  created_at: string;
  updated_at: string;
  last_seen: string;
  fb_id: string | null;
  tickets: number;
  revenue: number;
  earned: number;
  facebook_id: string | null;
  google_id: string | null;
  verified: boolean;
  verification_code: string | null;
  marketing_consent: boolean;
  marketing_lang: string | null;
  manager_id: number | null;
  currency_code: string | null;
  region_id: number;
  google_meet_token: string | null;
  google_refresh_token: string | null;
  google_email: string | null;
  is_verified_by_company: boolean;
  fcm_token: string;
  region: Region;
}

interface Region {
  id: number;
  name: string;
  slug: string;
  currency_code: string;
  coefficient: number;
  autoselect: number;
  attachment: number;
  consilium: number;
}


export type PasswordTypes = {
  current_password: string,
  new_password: string,
  password_confirmation: string,
}

type PersonalDataTypes = {
  name: string;
  email: string;
  specialization: string;
  bio: string;
  professionalTitle: string;
  experience: string;
  workplace: string;
  education: string;
}