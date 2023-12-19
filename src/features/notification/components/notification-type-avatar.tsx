import { Avatar } from "antd";
import {
  HiClipboardList,
  HiThumbDown,
  HiThumbUp,
  HiKey,
  HiUserAdd,
  HiViewGridAdd,
} from "react-icons/hi";
import { INotifications } from "../types";

export const notificationTypeAvatar = (notifications: INotifications) => {
  const { type, data } = notifications;
  switch (type) {
    case "chat_archived":
    case "new_ticket":
    case "info":
    case "note":
    case "info_with_link":
      return (
        <Avatar
          shape="circle"
          className="flex h-9 w-9 items-center justify-center bg-blue-100 !text-2xl text-blue-600 dark:bg-blue-500/20 dark:text-blue-100	"
          icon={<HiClipboardList />}
        />
      );
    case "new_referral":
    case "new_referral_revenue":
      return (
        <Avatar
          shape="circle"
          className="flex h-9 w-9 items-center justify-center bg-emerald-100 !text-2xl text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-100	"
          icon={<HiViewGridAdd />}
        />
      );
    case "invite_to_chat":
      return (
        <Avatar
          shape="circle"
          className="flex h-9 w-9 items-center justify-center bg-emerald-100 !text-2xl text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-100	"
          icon={<HiUserAdd />}
        />
      );
    case "new_review":
      return (
        <Avatar
          shape="circle"
          className={
            data.like
              ? "flex h-9 w-9 items-center justify-center bg-emerald-100 !text-2xl text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-100	"
              : "flex h-9 w-9 items-center justify-center bg-red-100 !text-2xl text-red-600 dark:bg-red-500/20 dark:text-red-100	"
          }
          icon={data.like ? <HiThumbUp /> : <HiThumbDown />}
        />
      );
    case "reset_password":
      return (
        <Avatar
          shape="circle"
          className="flex h-9 w-9 items-center justify-center bg-amber-100 !text-2xl text-amber-600 dark:bg-amber-500/20 dark:text-amber-100	"
          icon={<HiKey />}
        />
      );
    default:
      return <Avatar className="h-9 w-9" />;
  }
};
