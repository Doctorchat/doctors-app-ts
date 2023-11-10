import React, { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui";

import i18n from "@/lib/i18n";
import { Avatar, Tooltip } from "antd";
import { BellIcon } from "@heroicons/react/24/outline";
import { Badge } from "@/components/ui/BadgePoint";
import {
  HiOutlineBan,
  HiOutlineCalendar,
  HiOutlineClipboardCheck,
  HiOutlineMailOpen,
} from "react-icons/hi";
import ButtonIcon from "@/components/ui/buttonIcon";
import { Link } from "react-router-dom";
import acronym, { useTwColorByName } from "@/hooks/useTwColorByName";
const notificationLists = [
  {
    id: "b06ca3f5-8fb0-4979-a016-30dfe63e8fd6",
    target: "Jean Bowman",
    description: "invited you to new project.",
    date: "4 minutes ago",
    image: "thumb-8.jpg",
    type: 0,
    location: "",
    locationLabel: "",
    status: "",
    readed: false,
  },
  {
    id: "2152cd09-413a-44be-9d5a-b2b820c6a661",
    target: "Vickie Kim",
    description: "comment in your ticket.",
    date: "20 minutes ago",
    image: "",
    type: 0,
    location: "",
    locationLabel: "",
    status: "",
    readed: false,
  },
  {
    id: "f644235d-dffc-4f17-883f-1ada117ff2c9",
    target: "",
    description: "Please submit your daily report.",
    date: "1 hour ago",
    image: "",
    type: 1,
    location: "",
    locationLabel: "",
    status: "",
    readed: false,
  },
  {
    id: "8ca04d2c-0262-417b-8a3d-4ade49939059",
    target: "",
    description: "Your request was rejected",
    date: "2 days ago",
    image: "",
    type: 2,
    location: "",
    locationLabel: "",
    status: "failed",
    readed: true,
  },
  {
    id: "e55adc24-1803-4ffd-b653-09be273f8df5",
    target: "Jennifer Ruiz",
    description: "mentioned your in comment.",
    date: "2 days ago",
    image: "thumb-4.jpg",
    type: 0,
    location: "",
    locationLabel: "",
    status: "",
    readed: true,
  },
  {
    id: "8dd23dfd-a79b-40ad-b4e9-7e70a148d5b6",
    target: "",
    description: "Your request has been approved.",
    date: "4 minutes ago",
    image: "4 days ago",
    type: 2,
    location: "",
    locationLabel: "",
    status: "succeed",
    readed: true,
  },
];

const GeneratedAvatar = ({ target }: { target: string }) => {
  const color = useTwColorByName();
  return (
    <Avatar shape="circle" className={`${color(target)}`}>
      {acronym(target)}
    </Avatar>
  );
};
const imagePath = "/img/avatars/";
const notificationTypeAvatar = (data: {
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

const NotificationDropdown: React.FC = () => {
  const [unreadNotification, setUnreadNotification] = useState(false);
  const [noResult, setNoResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notificationList, setNotificationList] = useState<any[]>([]);
  const getNotificationCount = useCallback(async () => {
    // const resp = await apiGetNotificationCount();

    const resp = { data: { count: 4 } };
    if (resp.data.count > 0) {
      setNoResult(false);
      setUnreadNotification(true);
    } else {
      setNoResult(true);
    }
  }, [setUnreadNotification]);

  useEffect(() => {
    getNotificationCount();
    if (notificationList.length === 0) {
      setLoading(true);
      // const resp = await apiGetNotificationList();
      setLoading(false);
      console.log(notificationLists);

      setNotificationList(notificationLists);
    }
  }, [getNotificationCount, notificationLists, notificationList]);
  // const onNotificationOpen = useCallback(async () => {
  //   if (notificationLists.length === 0) {
  //     setLoading(true);
  //     // const resp = await apiGetNotificationList();
  //     setLoading(false);
  //     console.log(notificationLists);

  //     setNotificationList(notificationLists);
  //   }
  // }, [notificationList, setLoading]);

  const onMarkAllAsRead = useCallback(
    (e: any) => {
      const list = notificationList.map((item: any) => {
        if (!item.readed) {
          item.readed = true;
        }
        return item;
      });
      setNotificationList(list);
      setUnreadNotification(false);
    },
    [notificationList]
  );

  const onMarkAsRead = useCallback(
    (id: string, event: any) => {
      event.preventDefault();

      const list = notificationList.map((item) => {
        if (item.id === id) {
          item.readed = true;
        }
        return item;
      });
      console.log(notificationList);
      console.log(list);
      setNotificationList(list);
      const hasUnread = notificationList.some((item) => !item.readed);

      if (!hasUnread) {
        setUnreadNotification(false);
      }
    },
    [notificationList]
  );
  const isLastChild = (arr: Array<unknown>, index: number) => {
    return arr.length === index + 1;
  };

  return (
    <div className="mr-2 ">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            key="NotificationDropdowns"
            variant="ghost"
            size="icon"
            aria-label="NotificationDropdowns"
            className="h-10 w-10 rounded-full"
          >
            <div className="text-2xl">
              {unreadNotification ? (
                <Badge badgeStyle={{ top: "2px", right: "3px" }}>
                  <BellIcon className="h-6 w-6" />
                </Badge>
              ) : (
                <BellIcon className="h-6 w-6" />
              )}
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="bottom" align="end" className="w-80">
          <div className="flex items-center justify-between border-b border-gray-200 px-4 py-2 dark:border-gray-600">
            <h6 className="font-semibold">Notifications</h6>
            <Tooltip title="Mark all as read">
              <ButtonIcon
                variant="plain"
                shape="circle"
                size="sm"
                icon={<HiOutlineMailOpen className="text-xl" />}
                onClick={onMarkAllAsRead}
              />
            </Tooltip>
          </div>

          <div className="h-72 overflow-y-auto ">
            <div className="custom-scroll-bar  bg-white-600 space-y-0.5 overflow-y-auto">
              {notificationList.length > 0 &&
                notificationList.map((item, index) => (
                  <DropdownMenuItem className="p-0">
                    <div
                      key={item.id}
                      className={`relative flex w-full cursor-pointer py-3 pl-3 pr-6 hover:bg-gray-50 active:bg-gray-100 dark:hover:bg-black dark:hover:bg-opacity-20  ${
                        !isLastChild(notificationList, index)
                          ? "border-b border-gray-200 dark:border-gray-600"
                          : ""
                      }`}
                      onClick={(event) => onMarkAsRead(item.id, event)}
                    >
                      <div>{notificationTypeAvatar(item)}</div>
                      <div className="ltr:ml-3 rtl:mr-3">
                        <div>
                          {item.target && (
                            <span className="heading-text font-semibold">{item.target} </span>
                          )}
                          <span>{item.description}</span>
                        </div>
                        <span className="text-xs">{item.date}</span>
                      </div>
                      <Badge
                        className="absolute top-3 mt-1.5 ltr:right-4 rtl:left-4"
                        innerClass={`${
                          item.readed
                            ? "bg-gray-300"
                            : " ring-indigo-600 border-indigo-600 bg-indigo-600 text-indigo-600"
                        } `}
                      />
                    </div>
                  </DropdownMenuItem>
                ))}
              {loading && (
                <div className="flex h-72 items-center justify-center">
                  {/* <Spinner size={40} /> */}
                </div>
              )}
              {noResult && (
                <DropdownMenuItem>
                  <div className="flex h-72 items-center justify-center">
                    <div className="text-center">
                      <img
                        className="mx-auto mb-2 max-w-[150px]"
                        src="/img/others/no-notification.png"
                        alt="no-notification"
                      />
                      <h6 className="font-semibold">No notifications!</h6>
                      <p className="mt-1">Please Try again later</p>
                    </div>
                  </div>
                </DropdownMenuItem>
              )}
            </div>
          </div>

          {/* variant="header" */}
          <DropdownMenuItem>
            <div className="flex justify-center border-t border-gray-200 px-4 py-2 dark:border-gray-600">
              <Link
                to="/app/account/activity-log"
                className="cursor-pointer p-2 px-3 font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-200 dark:hover:text-white"
              >
                View All Activity
              </Link>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export { NotificationDropdown };
