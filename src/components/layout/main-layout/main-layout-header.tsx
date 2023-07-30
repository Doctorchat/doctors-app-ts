import {
  ArrowRightOnRectangleIcon,
  Bars3BottomLeftIcon,
  BellIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";
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
import { cn } from "@/utils";

export interface MainLayoutHeaderProps extends React.HTMLAttributes<HTMLElement> {}

export const MainLayoutHeader: React.FC<MainLayoutHeaderProps> = ({ className, ...props }) => {
  const { t } = useTranslation();
  const { clearSession } = useAuth();

  const { isCollapsed, setIsCollapsed, isOverlay, setIsOverlay } = useMainLayoutSidenavStore(
    (store) => ({
      isCollapsed: store.isCollapsed,
      setIsCollapsed: store.setIsCollapsed,
      isOverlay: store.isOverlay,
      setIsOverlay: store.setIsOverlay,
    }),
    shallow,
  );
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <header
      className={cn(
        "flex h-16 flex-shrink-0 items-center justify-between border-b border-neutral-200 px-5",
        className,
      )}
      {...props}
    >
      <Button
        key="sidenav"
        variant="ghost"
        size="icon"
        className="h-10 w-10 rounded-full"
        onClick={() => {
          if (isMobile) setIsOverlay(!isOverlay);
          else setIsCollapsed(!isCollapsed);
        }}
      >
        <Bars3BottomLeftIcon className="h-6 w-6" />
      </Button>
      <div className="ml-2 flex items-center justify-center">
        <Button key="notifications" variant="ghost" size="icon" className="h-10 w-10 rounded-full">
          <BellIcon className="h-6 w-6" />
        </Button>
        <Button key="settings" variant="ghost" size="icon" className="ml-2 h-10 w-10 rounded-full">
          <Cog6ToothIcon className="h-6 w-6" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar key="avatar" className="ml-4 h-8 w-8 cursor-pointer">
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="bottom" align="end" className="w-60">
            <div className="flex items-center p-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div className="ml-2 overflow-hidden">
                <div className="truncate text-sm font-bold text-typography-primary">
                  Carolyn Perkins
                </div>
                <div className="truncate text-xs text-typography-secondary">
                  carolyn.p@elstar.com
                </div>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              {t("common:settings")}
              <DropdownMenuShortcut>
                <Cog6ToothIcon className="h-5 w-5" />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                apiLogout().catch(() => {});
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
