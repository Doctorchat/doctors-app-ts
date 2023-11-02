import {
  ArrowRightOnRectangleIcon,
  Bars3BottomLeftIcon,
  BellIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import { formatIncompletePhoneNumber } from "libphonenumber-js/min";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "usehooks-ts";
import { shallow } from "zustand/shallow";

import { useMainLayoutSidenavStore } from "./main-layout-sidenav";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui";
import { apiLogout, useAuth } from "@/features/auth";
import { cn, getInitials } from "@/utils";
import { ProfileChangeLang } from "@/features/localization/components/profile-change-lang";
import { useNavigate } from "react-router";
import React from "react";
import { getMessaging, onMessage } from "firebase/messaging";
import { firebaseApp } from "@/features/notification-firebase/api/config";
import { useLocation } from "react-router-dom";
import { Tooltip } from "antd";

export interface MainLayoutHeaderProps extends React.HTMLAttributes<HTMLElement> {}

export const MainLayoutHeader: React.FC<MainLayoutHeaderProps> = ({ className, ...props }) => {
  const { t } = useTranslation();
  const { session, clearSession } = useAuth();
  const location = useLocation();

  React.useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      const messaging = getMessaging(firebaseApp);
      const unsubscribe = onMessage(messaging, (payload: any) => {
        console.log([payload]);
        const { title, body } = payload.data;
        const bodyData = JSON.parse(body);
        //  const searchParams = new URLSearchParams(location.search);
        //  const paramValue = searchParams.get("paramName");

        const chatId = location.search
          ? new URLSearchParams(location.search).get(
              bodyData.isPatientDoctorChat ? "patientId" : "doctorId"
            )
          : false;
        console.log(
          !chatId || Number(chatId) !== Number(bodyData.chat_id),
          location.search,
          new URLSearchParams(location.search).get(
            bodyData.isPatientDoctorChat ? "patientId" : "doctorId"
          )
        );

        if (!chatId || Number(chatId) !== Number(bodyData.chat_id)) {
          const notification = new Notification(title, {
            body: bodyData.content,
            icon: "https://doctorchat.md/wp-content/themes/doctorchat/favicon/apple-touch-icon.png",
          });
          const chat_type = bodyData.isPatientDoctorChat ? "patientId=" : "doctorId=";
          const url =
            window.location.origin +
            "/conversations?" +
            chat_type +
            (bodyData.chat_id ?? chatId) +
            "&anonymous=false";
          notification.onclick = () => {
            window.open(url);
          };
        }
      });

      return () => {
        unsubscribe();
      };
    }
  }, [location, location.search]);

  const { isCollapsed, setIsCollapsed, isOverlay, setIsOverlay } = useMainLayoutSidenavStore(
    (store) => ({
      isCollapsed: store.isCollapsed,
      setIsCollapsed: store.setIsCollapsed,
      isOverlay: store.isOverlay,
      setIsOverlay: store.setIsOverlay,
    }),
    shallow
  );
  const isMobile = useMediaQuery("(max-width: 768px)");
  const navigate = useNavigate();
  return (
    <header
      className={cn(
        "flex h-16 flex-shrink-0 items-center justify-between border-b border-neutral-200 px-5",
        className
      )}
      {...props}
    >
      <Button
        key="sidenav"
        variant="ghost"
        size="icon"
        aria-label="Sidenav"
        className="h-10 w-10 rounded-full"
        onClick={() => {
          if (isMobile) setIsOverlay(!isOverlay);
          else setIsCollapsed(!isCollapsed);
        }}
      >
        <Bars3BottomLeftIcon className="h-6 w-6" />
      </Button>
      <div className="ml-2 flex items-center justify-center">
        <ProfileChangeLang />
        <Tooltip title={t("common:coming_soon")} color="#2db7f5">
          <Button
            key="notifications"
            variant="ghost"
            size="icon"
            aria-label="Notifications"
            className="h-10 w-10 rounded-full"
          >
            <BellIcon className="h-6 w-6" />
          </Button>
        </Tooltip>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              key="avatar"
              type="button"
              aria-label="User menu"
              className="ml-4 flex h-10 w-10 cursor-pointer items-center justify-center outline-none"
            >
              <Avatar>
                <AvatarImage src={session.user?.avatar} alt={session.user?.name} />
                <AvatarFallback>{getInitials(session.user?.name)}</AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="bottom" align="end" className="w-60">
            <div className="flex items-center p-2">
              <Avatar>
                <AvatarImage src={session.user?.avatar} alt={session.user?.name} />
                <AvatarFallback>{getInitials(session.user?.name)}</AvatarFallback>
              </Avatar>
              <div className="ml-2 overflow-hidden">
                <div className="truncate text-sm font-medium text-typography-primary">
                  {session.user?.name}
                </div>
                <div className="truncate text-xs text-typography-secondary">
                  {session.user?.email ?? formatIncompletePhoneNumber(session.user?.phone ?? "")}
                </div>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/profile")}>
              {t("common:settings")}
              <DropdownMenuShortcut>
                <Cog6ToothIcon className="h-5 w-5" />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={async () => {
                await apiLogout();
                clearSession();
              }}
            >
              {t("auth:logout")}
              <DropdownMenuShortcut>
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
