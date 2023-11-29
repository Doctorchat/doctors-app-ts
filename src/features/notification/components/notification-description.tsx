import { Avatar } from "antd";
import { useTranslation } from "react-i18next";

import { HiClipboardList, HiInformationCircle, HiThumbDown, HiThumbUp } from "react-icons/hi";

export const notificationDescription = (data: {
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
  data: {
    user_name: string;
  };
  isMeet?: number;
  amount?: string;
  currency?: string;
}) => {
  const {
    type,
    data: { user_name },
    isMeet,
    amount,
    currency,
  } = data;
  const { t } = useTranslation();
  
  switch (type) {
    case "new_ticket":
      return isMeet
        ? t("type_new_ticket_video", { user_name: user_name })
        : t("type_new_ticket_chat", { user_name: user_name });

    case "new_topup":
      return t("type_new_topup", { amount: amount, currency: currency });

    case "new_referral":
      // Referalul {user_name} s-a înregistrat.
      return t("type_new_referral", { user_name: user_name });

    case "new_referral_revenue":
      return t("type_new_ticket");

    case "new_review":
      return t("type_new_ticket");

    case "chat_archived":
      return t("type_new_ticket");

    case "reset_password":
      return t("type_new_ticket");

    case "invite_to_chat":
      return t("type_new_ticket");

    case "info":
      return t("type_new_ticket");

    case "info_with_link":
      return t("type_new_ticket");

    case "note":
      return t("type_new_ticket");

    default:
      return <Avatar />;
  }
};
