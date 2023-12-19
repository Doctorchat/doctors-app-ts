import { ArrowRightOnRectangleIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";
import { formatIncompletePhoneNumber } from "libphonenumber-js/min";
import { useTranslation } from "react-i18next";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui";
import { apiLogout, useAuth } from "@/features/auth";
import { getInitials } from "@/utils";
import { useNavigate } from "react-router";
import React from "react";
import { useQueryClient } from "react-query";

export interface ProfileChangeLangProps {
  disabled?: boolean;
}

const UserDropdown: React.FC = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { session, clearSession } = useAuth();
  const { t } = useTranslation();
  return (
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
            queryClient.clear();
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
  );
};

export { UserDropdown };
