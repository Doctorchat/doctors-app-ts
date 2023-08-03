import type { UserCard as UserCardType } from "../types";

import React from "react";
import { useNavigate } from "react-router-dom";

import { ArrowLeftIcon, EllipsisVerticalIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { formatDistance, parseISO } from "date-fns";
import { ro, ru } from "date-fns/locale";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "usehooks-ts";

import { UserCard } from "./user-card";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
  Skeleton,
} from "@/components/ui";
import { useAppI18n } from "@/hooks";
import { cn, getInitials } from "@/utils";

export interface HeaderProps {
  card?: UserCardType;
  isLoading: boolean;
}

export const Header: React.FC<HeaderProps> = ({ card, isLoading }) => {
  const { t } = useTranslation();
  const { locale } = useAppI18n();

  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 1024px)");

  const [isUserCardOpen, setIsUserCardOpen] = React.useState(false);

  return (
    <>
      <UserCard open={isUserCardOpen} onOpenChange={setIsUserCardOpen} card={card} />

      <header className="flex h-16 items-center justify-between space-x-4 border-b border-neutral-200 px-5">
        <div className="flex flex-1 items-center">
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full"
              onClick={() => navigate("/conversations")}
            >
              <ArrowLeftIcon className="h-6 w-6" />
            </Button>
          )}

          {isLoading ? (
            <Skeleton
              className={cn("h-12 w-12 flex-shrink-0 rounded-full", { "ml-4": isMobile })}
            />
          ) : (
            <Avatar className={cn("h-12 w-12", { "ml-4": isMobile })}>
              <AvatarImage src={card?.avatar} alt={card?.name} />
              <AvatarFallback>{getInitials(card?.name)}</AvatarFallback>
            </Avatar>
          )}

          {isLoading ? (
            <div className="ml-3 flex-1 overflow-hidden">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="mt-2 h-4 w-24" />
            </div>
          ) : (
            <div className="ml-3 flex-1 overflow-hidden">
              <h3 className="truncate font-medium text-typography-primary">{card?.name}</h3>
              <p className="truncate text-sm">
                {card?.last_seen && (
                  <time dateTime={card?.last_seen}>
                    {formatDistance(parseISO(card?.last_seen), new Date(), {
                      addSuffix: true,
                      locale: locale === "ru" ? ru : ro,
                    })}
                  </time>
                )}
              </p>
            </div>
          )}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              disabled={isLoading}
              className="h-10 w-10 rounded-full"
            >
              <EllipsisVerticalIcon className="h-6 w-6" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="bottom" align="end" className="w-40">
            <DropdownMenuItem onClick={() => setIsUserCardOpen(true)}>
              {t("common:details")}
              <DropdownMenuShortcut>
                <UserCircleIcon className="h-5 w-5" />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>
    </>
  );
};
