import React from "react";
import GeneratedAvatar from "./generated-avatar";
import { Avatar } from "antd";

import { HiOutlineBan, HiOutlineCalendar, HiOutlineClipboardCheck } from "react-icons/hi";

const imagePath = "/img/avatars/";

export const notificationTypeAvatar = (data: {
  type: number;
  target: string;
  image: string;
  status: string;
}) => {
  const { type, target, image, status } = data;
  switch (type) {
    case 0:
      if (image) {
        return <Avatar shape="circle" src={`${imagePath}${image}`} />;
      } else {
        return <GeneratedAvatar target={target} />;
      }
    case 1:
      return (
        <Avatar
          shape="circle"
          className="bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-100"
          icon={<HiOutlineCalendar />}
        />
      );
    case 2:
      return (
        <Avatar
          shape="circle"
          className={
            status === "succeed"
              ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-100"
              : "bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-100"
          }
          icon={status === "succeed" ? <HiOutlineClipboardCheck /> : <HiOutlineBan />}
        />
      );
    default:
      return <Avatar />;
  }
};
