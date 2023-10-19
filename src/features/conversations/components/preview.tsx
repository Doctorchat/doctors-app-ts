import type { ConversationDoctors, ConversationPreview } from "../types";

import { Link, useSearchParams } from "react-router-dom";

import { formatDistance, parseISO } from "date-fns";
import { useTranslation } from "react-i18next";

import { Avatar, AvatarFallback, AvatarImage, Badge, Skeleton } from "@/components/ui";
import { useAppI18n } from "@/hooks";
import { cn, getInitials } from "@/utils";

export interface PreviewProps {
  conversation: ConversationPreview;
  typeConversation: "patients" | "doctors";
}

export const Preview: React.FC<PreviewProps> = ({ conversation, typeConversation }) => {
  const { t } = useTranslation();
  const { locale } = useAppI18n();

  const [searchParams] = useSearchParams();
  const chatType = typeConversation === "patients" ? "patient" : "doctor";

  return (
    <Link
      to={`/conversations?${chatType}Id=${conversation.id}&anonymous=${
        conversation.isAnonym ?? "false"
      }`}
      className={cn(
        "flex items-center overflow-hidden rounded-lg p-3 transition-colors",
        "active:bg-neutral-200 md:hover:bg-neutral-200",
        {
          "bg-neutral-200":
            Number(searchParams.get("patientId") ?? searchParams.get("doctorId")) ===
            conversation.id,
        }
      )}
    >
      <div className="relative flex-shrink-0">
        <Avatar className="h-12 w-12">
          <AvatarImage
            src={conversation.avatar ?? null}
            alt={conversation.name ?? conversation.title}
          />
          <AvatarFallback>{getInitials(conversation.name ?? conversation.title)}</AvatarFallback>
        </Avatar>
        {conversation.isOnline && (
          <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-white" />
        )}
      </div>

      <div className="ml-3 flex-1 overflow-hidden">
        <div className="flex h-5 items-center overflow-hidden">
          <div className="flex flex-1 items-center overflow-hidden">
            <h2 className="truncate font-medium text-typography-primary">
              {conversation.name ?? conversation.title}
            </h2>

            {conversation.company_id && (
              <Badge variant="outline" className="ml-1 whitespace-nowrap px-2 py-px">
                {t("conversations:corporate_client")}
              </Badge>
            )}
          </div>

          <span className="ml-2 whitespace-nowrap text-xs">
            <time dateTime={conversation.updated ?? conversation.updated_at}>
              {/* {formatDistance(
                parseISO(conversation.updated ?? conversation.updated_at),
                new Date(),
                {
                  addSuffix: true,
                  locale: locale(),
                }
              )} */}
            </time>
          </span>
        </div>

        <div className="mt-1.5 flex h-5 items-center overflow-hidden">
          {conversation.description && (
            <p className="flex-1 truncate text-sm">{conversation.description}</p>
          )}
          {conversation.lastMessage && (
            <p className="flex-1 truncate text-sm">{conversation.lastMessage.content}</p>
          )}
          {(conversation.unread ?? conversation.unreadCount) > 0 && (
            <span className="ml-2 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-rose-600 text-xs font-medium text-white">
              {conversation.unread ?? conversation.unreadCount}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export const PreviewSkeleton: React.FC = () => {
  return (
    <div className="pointer-events-none flex items-center overflow-hidden rounded-lg p-3">
      <Skeleton className="h-12 w-12 flex-shrink-0 rounded-full" />
      <div className="ml-3 flex-1">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-10" />
        </div>
        <div className="mt-3">
          <Skeleton className="h-4 w-10/12" />
        </div>
      </div>
    </div>
  );
};
