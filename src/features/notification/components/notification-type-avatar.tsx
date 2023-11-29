import { Avatar } from "antd";

import { HiClipboardList, HiInformationCircle, HiThumbDown, HiThumbUp } from "react-icons/hi";

export const notificationTypeAvatar = (data: {
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
  like?: number;
}) => {
  const { type, like } = data;
  switch (type) {
    case "new_ticket" || "chat_archived" || "info" || "info_with_link":
      return (
        <Avatar
          shape="circle"
          className="bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-100"
          icon={<HiClipboardList />}
        />
      );
    case "new_topup" || "new_referral" || "new_referral_revenue" || "invite_to_chat":
      return (
        <Avatar
          shape="circle"
          className="bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-100"
          icon={<HiInformationCircle />}
        />
      );
    case "note":
      return (
        <Avatar
          shape="circle"
          className="bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-100"
          icon={<HiClipboardList />}
        />
      );
    case "new_review":
      return (
        <Avatar
          shape="circle"
          className={
            like
              ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-100"
              : "bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-100"
          }
          icon={like ? <HiThumbUp /> : <HiThumbDown />}
        />
      );
    default:
      return <Avatar />;
  }
};
