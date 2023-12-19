import { Bars3BottomLeftIcon } from "@heroicons/react/24/outline";
import { useMediaQuery } from "usehooks-ts";
import { shallow } from "zustand/shallow";
import { useMainLayoutSidenavStore } from "./main-layout-sidenav";
import { Button } from "@/components/ui";
import { cn } from "@/utils";
import { ProfileChangeLang } from "@/features/localization/components/profile-change-lang";
import React from "react";
import { getMessaging, onMessage } from "firebase/messaging";
import { firebaseApp } from "@/features/notification-firebase/api/config";
import { useLocation, useNavigate } from "react-router-dom";

import { UserDropdown } from "@/features/user-dropdown/components";
import { NotificationDropdown } from "@/features/notification/components";

export interface MainLayoutHeaderProps extends React.HTMLAttributes<HTMLElement> {}

export const MainLayoutHeader: React.FC<MainLayoutHeaderProps> = ({ className, ...props }) => {
  const location = useLocation();
  const navigate = useNavigate();
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
        <NotificationDropdown navigate={navigate} />
        <UserDropdown />
      </div>
    </header>
  );
};
