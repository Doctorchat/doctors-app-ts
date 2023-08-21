export interface IReferral {
  id: number;
  name: string;
  email: string;
  phone: string;
  created_at: string;
}

interface ITransaction {
  id: number;
  amount: string;
  created_at: string;
}

interface IPaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

interface ITransactionsPagination {
  current_page: number;
  data: ITransaction[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: IPaginationLink[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export interface PartnerData {
  partner_url: string;
  partner_qr: string;
  percent: number;
  earned: number;
  currency: string;
  referrals: IReferral[];
  transactions: ITransactionsPagination;
}