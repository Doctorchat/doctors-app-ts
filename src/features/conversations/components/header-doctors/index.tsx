import React from "react";
import { useNavigate } from "react-router-dom";

import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { formatDistance, parseISO } from "date-fns";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "usehooks-ts";
import { Avatar, AvatarFallback, AvatarImage, Button, Skeleton } from "@/components/ui";
import { useAppI18n } from "@/hooks";
import { cn, getInitials } from "@/utils";
import { useConversation } from "../../hooks";

export const HeaderDoctors: React.FC = () => {
  const { t } = useTranslation();
  const { locale } = useAppI18n();
  const { cardDoctors, isCardDoctorsLoading, isCardDoctorsErrored, conversationDoctors } =
    useConversation();

  const navigate = useNavigate();

  const [isUserCardOpen, setIsUserCardOpen] = React.useState(false);

  const isMobile = useMediaQuery("(max-width: 1024px)");
  const isLoading =
    isCardDoctorsLoading || (!conversationDoctors?.doctor_chat_id && !isCardDoctorsErrored);

  return (
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
          <Skeleton className={cn("h-12 w-12 flex-shrink-0 rounded-full", { "ml-4": isMobile })} />
        ) : (
          <Avatar className={cn("h-12 w-12", { "ml-4": isMobile })}>
            <AvatarImage src={cardDoctors?.avatar} alt={cardDoctors?.chatInfo?.title} />
            <AvatarFallback>{getInitials(cardDoctors?.chatInfo?.title)}</AvatarFallback>
          </Avatar>
        )}

        {isLoading ? (
          <div className="ml-3 flex-1 overflow-hidden">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="mt-2 h-4 w-24" />
          </div>
        ) : (
          <div className="ml-3 flex-1 overflow-hidden">
            <h3 className="truncate font-medium text-typography-primary">
              {cardDoctors?.chatInfo?.title}
            </h3>
            {cardDoctors?.chatInfo?.members > 1 ? (
              <p className="truncate text-sm">
                {cardDoctors?.chatInfo?.members + " " + t("conversations:new_chat_doctors.members")}
              </p>
            ) : (
              cardDoctors?.chatInfo?.members === 1 && (
                <div className="truncate text-sm">
                  {cardDoctors.members &&
                    Object.keys(cardDoctors?.members)?.map((item: any, index: any) => {
                      return index === 0 && cardDoctors?.members[item].updated ? (
                        <p>
                          <time dateTime={cardDoctors?.members[item].updated}>
                            {formatDistance(
                              parseISO(cardDoctors?.members[item].updated),
                              new Date(),
                              {
                                addSuffix: true,
                                locale: locale(),
                              }
                            )}
                          </time>
                        </p>
                      ) : (
                        <p className="truncate text-sm">
                          {cardDoctors?.chatInfo?.members +
                            " " +
                            t("conversations:new_chat_doctors.member")}
                        </p>
                      );
                    })}
                </div>
              )
            )}
          </div>
        )}
      </div>

      {/* <DropdownMenu>
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
      </DropdownMenu> */}
    </header>
  );
};
