import React, { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui";
import { Tooltip } from "antd";
import { formatDistance, parseISO } from "date-fns";
import { BellIcon } from "@heroicons/react/24/outline";
import { Badge } from "@/components/ui/BadgePoint";
import { HiOutlineMailOpen } from "react-icons/hi";
import ButtonIcon from "@/components/ui/buttonIcon";
import { notificationTypeAvatar } from "./notification-type-avatar";
import {
  apiGetNotificationList,
  apiGetNotificationNext,
  apiGetNotificationRead,
  apiGetNotificationReadAll,
  apiGetNotificationUnreadable,
} from "../api";
import { INotifications } from "../types";
import {
  isButtonNotification,
  isLinkChatId,
  isLinkNotification,
  notificationDescription,
  typeEmptyContent,
} from "./notification-description";
import { useTranslation } from "react-i18next";
import { useAppI18n } from "@/hooks";

const NotificationDropdown: React.FC<any> = (props) => {
  const [unreadNotification, setUnreadNotification] = useState<boolean>(false);
  const [noResult, setNoResult] = useState<boolean>(false);
  const [numberUnreadNotifications, setNumberUnreadNotifications] = useState(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [notificationList, setNotificationList] = useState<INotifications[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { locale } = useAppI18n();

  const getNotificationCount = useCallback(async () => {
    const responce = await apiGetNotificationUnreadable();
    if (responce.unread > 0) {
      setNumberUnreadNotifications(responce.unread);
      setUnreadNotification(true);
      setNoResult(false);
    } else {
      setNumberUnreadNotifications(0);
      setUnreadNotification(false);
    }
  }, []);

  const getMoreNotifications = useCallback(
    async (event: any) => {
      event.preventDefault();
      const newPage = await apiGetNotificationNext(currentPage);
      if (newPage) {
        const current = newPage.notifications.current_page;
        const last = newPage.notifications.last_page;
        const next = current && last && (current < last ? current + 1 : 1);
        setNotificationList([...notificationList, ...newPage.notifications.data]);
        next && setCurrentPage(next);
      }
    },
    [currentPage, getNotificationCount]
  );

  useEffect(() => {
    getNotificationCount();
  }, [getNotificationCount]);

  const onNotificationOpen = useCallback(async () => {
    if (notificationList.length === 0) {
      setLoading(true);
      const notifications = await apiGetNotificationList();
      if (notifications) {
        const current = notifications.notifications.current_page;
        const last = notifications.notifications.last_page;
        const next = current && last && (current < last ? current + 1 : 1);
        setCurrentPage(next ?? 1);
        setLoading(false);
        setNotificationList(notifications.notifications.data);
      } else {
        setNoResult(true);
      }
    }
  }, [notificationList, setLoading]);

  const onMarkAllAsRead = useCallback(async () => {
    const ids: number[] = [];
    const list = notificationList.map((item: any) => {
      if (!item.read_at) {
        item.read_at = new Date().toString();
        ids.push(item.id);
      }
      return item;
    });
    if (ids.length) {
      setNumberUnreadNotifications(numberUnreadNotifications - ids.length);
      await apiGetNotificationReadAll(ids);
      setNotificationList(list);
      setUnreadNotification(false);
    }
  }, [notificationList, getNotificationCount]);

  const onMarkAsRead = useCallback(
    async (id: number, read_at: string | number | null, event: any) => {
      event.preventDefault();
      if (!read_at) {
        const list = notificationList.map((item) => {
          if (item.id === id) {
            item.read_at = new Date().toString();
          }
          return item;
        });

        await apiGetNotificationRead(id);
        setNumberUnreadNotifications(numberUnreadNotifications - 1);
        setNotificationList(list);
        const hasUnread = notificationList.some((item) => !item.read_at);
        if (!hasUnread) {
          setUnreadNotification(false);
        }
      }
    },
    [notificationList]
  );
  const isLastChild = (arr: Array<any>, index: number) => {
    return arr.length === index + 1;
  };
  const { t } = useTranslation();

  return (
    <div className="mr-2 ">
      <DropdownMenu key="MenuNotifications" onOpenChange={onNotificationOpen}>
        <DropdownMenuTrigger asChild key="NotificationDropdowns">
          <Button
            key="NotificationDropdowns"
            variant="ghost"
            size="icon"
            aria-label="NotificationDropdowns"
            className="h-10 w-10 rounded-full"
          >
            <div className="text-2xl">
              {numberUnreadNotifications > 0 ? (
                <Badge badgeStyle={{ top: "2px", right: "3px" }}>
                  <BellIcon className="h-6 w-6" />
                </Badge>
              ) : (
                <BellIcon className="h-6 w-6" />
              )}
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="bottom" align="end" className="w-96" key="NotificationContent">
          <div className="flex items-center justify-between border-b border-gray-200 px-4 py-2 dark:border-gray-600">
            <h6 className="font-semibold">{t("notification:title_notification")}</h6>
            <Tooltip title={t("notification:mark_all_read")} color="blue">
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
                notificationList.map((item, index) => {
                  const descriptionNotif: any = typeEmptyContent.includes(item.type)
                    ? item.data.content
                    : notificationDescription(item);

                  const chatId = isLinkChatId.includes(item.type) ? item.data.chat_id : "";

                  const isLinkOnButton =
                    isLinkNotification[item.type] && isButtonNotification[item.type]
                      ? isLinkNotification[item.type]?.link + (chatId ?? "")
                      : "";

                  const customLink = item.type === "info_with_link" ? item.data.link : "";

                  const contentText =
                    " " +
                    (descriptionNotif?.text
                      ? t(
                          (`notification:` + descriptionNotif.text) as string,
                          descriptionNotif.data as {}
                        )
                      : descriptionNotif);

                  return (
                    <DropdownMenuItem
                      className="p-0"
                      key={index}
                      onClick={(event) => onMarkAsRead(item.id, item.read_at, event)}
                    >
                      <div
                        key={item.id}
                        className={`relative flex w-full cursor-pointer py-3 pl-3 pr-6 hover:bg-gray-50 active:bg-gray-100 dark:hover:bg-black dark:hover:bg-opacity-20  ${
                          !isLastChild(notificationList, index)
                            ? "border-b border-gray-200 dark:border-gray-600"
                            : ""
                        }`}
                      >
                        <div className="flex items-center">{notificationTypeAvatar(item)}</div>
                        <div className="w-full ltr:ml-3 rtl:mr-3">
                          <div>
                            {item.data.user_name && (
                              <span className="heading-text font-semibold">
                                {item.data.user_name}
                              </span>
                            )}
                            <span>{contentText}</span>
                          </div>
                          <div
                            className={`flex  ${
                              isButtonNotification[item.type] ? `justify-between` : `justify-end`
                            } pt-1`}
                          >
                            {isButtonNotification[item.type] && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  customLink
                                    ? window.open(customLink)
                                    : props.navigate(isLinkOnButton)
                                }
                              >
                                {t("notification:open_notification")}
                              </Button>
                            )}
                            <span className="flex items-center whitespace-nowrap text-xs">
                              <time dateTime={item.updated_at ?? item.created_at}>
                                {formatDistance(
                                  parseISO(item.updated_at ? item.updated_at : item.created_at),
                                  new Date(),
                                  {
                                    addSuffix: true,
                                    locale: locale(),
                                  }
                                )}
                              </time>
                            </span>
                          </div>
                        </div>
                        <Badge
                          className="absolute top-3 mt-1.5 ltr:right-4 rtl:left-4"
                          innerClass={`${
                            item.read_at
                              ? " !bg-gray-300"
                              : " ring-indigo-600 border-indigo-600 bg-indigo-600 text-indigo-600"
                          } `}
                        />
                      </div>
                    </DropdownMenuItem>
                  );
                })}
              {loading && (
                <div className="flex h-72 w-full items-center justify-center">
                  {/* <Spinner size={40} /> */}
                  Loading ...
                </div>
              )}
              {noResult && (
                <DropdownMenuItem key="NoData">
                  <div className="flex h-72 w-full items-center justify-center">
                    <div className="text-center">
                      <img
                        className="mx-auto mb-2 max-w-[150px]"
                        src="/img/others/no-notification.png"
                        alt="no-notification"
                      />
                      <h6 className="font-semibold">{t("notification:no_notification")}</h6>
                    </div>
                  </div>
                </DropdownMenuItem>
              )}
            </div>
          </div>

          {currentPage > 1 && (
            <DropdownMenuItem onClick={(event) => getMoreNotifications(event)}>
              <div className="flex w-full justify-center border-t border-gray-200 px-4 py-2 dark:border-gray-600">
                <div className="cursor-pointer p-2 px-3 font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-200 dark:hover:text-white">
                  {t("notification:load_more")}
                </div>
              </div>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export { NotificationDropdown };
