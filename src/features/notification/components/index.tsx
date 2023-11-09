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
import { HiOutlineMailOpen } from "react-icons/hi";
import ButtonIcon from "@/components/ui/buttonIcon";
const notificationList = [
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
  }, [getNotificationCount]);
  const onNotificationOpen = useCallback(async () => {
    if (notificationList.length === 0) {
      setLoading(true);
      // const resp = await apiGetNotificationList();
      setLoading(false);
      setNotificationList(notificationList);
    }
  }, [notificationList, setLoading]);

  const onMarkAllAsRead = useCallback(() => {
    const list = notificationList.map((item: any) => {
      if (!item.readed) {
        item.readed = true;
      }
      return item;
    });
    setNotificationList(list);
    setUnreadNotification(false);
  }, [notificationList]);

  const onMarkAsRead = useCallback(
    (id: string) => {
      const list = notificationList.map((item) => {
        if (item.id === id) {
          item.readed = true;
        }
        return item;
      });
      setNotificationList(list);
      const hasUnread = notificationList.some((item) => !item.readed);

      if (!hasUnread) {
        setUnreadNotification(false);
      }
    },
    [notificationList]
  );
  const isLastChild =(arr: Array<unknown>, index: number)=> {
    return arr.length === index + 1
}

  return (
    <div className="mr-2 ">
      <DropdownMenu>
        <DropdownMenuTrigger onClick={onNotificationOpen} asChild>
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
        <DropdownMenuContent side="top" align="start">
          <DropdownMenuItem>
            variant="header"
            <div className="flex items-center justify-between border-b border-gray-200 px-4 py-2 dark:border-gray-600">
              <h6>Notifications</h6>
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
          </DropdownMenuItem>
          <div className="overflow-y-auto h-72">
            <div className="custom-scroll-bar  space-y-0.5 overflow-y-auto p-2">
              {notificationList.length > 0 &&
                notificationList.map((item, index) => (
                  <div
                    key={item.id}
                    className={`relative flex cursor-pointer px-4 py-4 hover:bg-gray-50 active:bg-gray-100 dark:hover:bg-black dark:hover:bg-opacity-20  ${
                      !isLastChild(notificationList, index)
                        ? "border-b border-gray-200 dark:border-gray-600"
                        : ""
                    }`}
                    onClick={() => onMarkAsRead(item.id)}
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
                      className="absolute top-4 mt-1.5 ltr:right-4 rtl:left-4"
                      innerClass={`${item.readed ? "bg-gray-300" : bgTheme} `}
                    />
                  </div>
                ))}
              {loading && (
                <div className="flex items-center justify-center h-72">
                  <Spinner size={40} />
                </div>
              )}
              {noResult && (
                <div className="flex items-center justify-center h-72">
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
              )}
            </ScrollBar>
          </div>
          <DropdownMenuItem variant="header">
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
