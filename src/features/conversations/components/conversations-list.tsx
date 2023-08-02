import React from "react";

import { useQuery } from "react-query";

import { ConversationPreview, ConversationPreviewSkeleton } from "./conversation-preview";
import { useMainLayoutSidenavStore } from "./conversations-layout";
import { apiGetConversationsWithPatients } from "../api";

import { ScrollArea } from "@/components/ui";
import { cn } from "@/utils";

export interface ConversationsListProps extends React.HTMLAttributes<HTMLDivElement> {}

export const ConversationsList: React.FC<ConversationsListProps> = ({ className, ...props }) => {
  const conversationsType = useMainLayoutSidenavStore((store) => store.conversationsType);

  const { data: conversations, isLoading } = useQuery({
    queryKey: ["conversations", conversationsType],
    queryFn: async () => {
      return apiGetConversationsWithPatients();
    },
  });

  return (
    <div
      className={cn(
        "col-span-12 h-full w-full p-px",
        "lg:col-span-5 lg:rounded-lg lg:border lg:border-neutral-200",
        "xl:col-span-4",
        className,
      )}
      {...props}
    >
      <ScrollArea vertical className="h-full">
        <div className="space-y-0.5 p-2">
          {conversations?.map((conversation) => (
            <ConversationPreview key={conversation.id} conversation={conversation} />
          ))}

          {isLoading &&
            Array.from({ length: 10 }).map((_, index) => (
              <ConversationPreviewSkeleton key={index} />
            ))}
        </div>
      </ScrollArea>
    </div>
  );
};
