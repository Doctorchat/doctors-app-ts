import type { UserCard as UserCardType } from "../types";

import { XMarkIcon } from "@heroicons/react/24/outline";
import { formatDistance, parseISO } from "date-fns";
import { useTranslation } from "react-i18next";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Sheet,
  SheetClose,
  SheetContent,
} from "@/components/ui";
import { useAppI18n } from "@/hooks";
import { calculateAge, getInitials } from "@/utils";

export interface UserCardProps extends React.ComponentPropsWithoutRef<typeof Sheet> {
  card?: UserCardType;
}

export const UserCard: React.FC<UserCardProps> = ({ card, ...props }) => {
  const { t } = useTranslation();
  const { locale } = useAppI18n();

  const investigation = card?.investigations ? card.investigations[0] : null;
  const age = investigation
    ? investigation?.birth_date && calculateAge(new Date(investigation.birth_date))
    : null;

  return (
    <Sheet {...props}>
      <SheetContent className="w-full max-w-sm">
        <SheetClose asChild>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-3.5 top-3.5 z-10 h-12 w-12 rounded-full"
          >
            <XMarkIcon className="h-6 w-6" />
          </Button>
        </SheetClose>

        <div className="flex items-center">
          <Avatar className="h-16 w-16">
            <AvatarImage src={card?.avatar} alt={card?.name} />
            <AvatarFallback>{getInitials(card?.name)}</AvatarFallback>
          </Avatar>
          <div className="ml-3 flex-1 overflow-hidden">
            <h2 className="truncate text-lg font-medium text-typography-primary">{card?.name}</h2>
            <p className="truncate">
              {card?.last_seen && (
                <time dateTime={card?.last_seen}>
                  {formatDistance(parseISO(card?.last_seen), new Date(), {
                    addSuffix: true,
                    locale: locale(),
                  })}
                </time>
              )}
            </p>
          </div>
        </div>
        <ul className="mt-6 divide-y divide-gray-200">
          <li className="py-3">
            <h3 className="text-sm">{t("common:activity")}</h3>
            <p className="mt-0.5 text-sm font-medium text-typography-primary">
              {investigation?.activity}
            </p>
          </li>
          <li className="py-3">
            <h3 className="text-sm">{t("common:age")}</h3>
            <p className="mt-0.5 text-sm font-medium text-typography-primary">
              {age && `${age.count} ${t(age.translation, { count: age.count })}`}
            </p>
          </li>
          <li className="py-3">
            <h3 className="text-sm">{t("common:height")}</h3>
            <p className="mt-0.5 text-sm font-medium text-typography-primary">
              {investigation?.height} cm
            </p>
          </li>
          <li className="py-3">
            <h3 className="text-sm">{t("common:weight")}</h3>
            <p className="mt-0.5 text-sm font-medium text-typography-primary">
              {investigation?.weight} kg
            </p>
          </li>
          <li className="py-3">
            <h3 className="text-sm">{t("common:bmi")}</h3>
            <p className="mt-0.5 text-sm font-medium text-typography-primary">
              {investigation?.bmi}
            </p>
          </li>
          <li className="py-3">
            <h3 className="text-sm">{t("common:sex")}</h3>
            <p className="mt-0.5 text-sm font-medium text-typography-primary">
              {investigation?.sex && t(investigation?.sex)}
            </p>
          </li>
          <li className="py-3">
            <h3 className="text-sm">{t("common:location")}</h3>
            <p className="mt-0.5 text-sm font-medium text-typography-primary">
              {investigation?.location}
            </p>
          </li>
        </ul>
      </SheetContent>
    </Sheet>
  );
};
