import React from "react";

import { useQuery } from "react-query";

import { useConversationLayoutStore } from "./layout";
import { Preview, PreviewSkeleton } from "./preview";
import { apiGetConversationsWithPatients } from "../api";

import { cn } from "@/utils";

export const List: React.FC = () => {
  const conversationsType = useConversationLayoutStore((store) => store.conversationsType);

  const { data: conversations, isLoading } = useQuery({
    queryKey: ["conversations", conversationsType],
    queryFn: async () => {
      return apiGetConversationsWithPatients();
    },
  });

  return (
    <div
      className={cn(
        "col-span-12 h-full w-full",
        "lg:col-span-5 lg:rounded-lg lg:border lg:border-neutral-200",
        "xl:col-span-4",
      )}
    >
      <div className="h-full space-y-0.5 overflow-y-auto p-2">
        {conversations?.map((conversation) => (
          <Preview key={conversation.id} conversation={conversation} />
        ))}

        {isLoading && Array.from({ length: 10 }).map((_, index) => <PreviewSkeleton key={index} />)}
      </div>
    </div>
  );
};
