import React, { useEffect, useState } from "react";

import { useQuery } from "react-query";

import { useConversationLayoutStore } from "./layout";
import { Preview, PreviewSkeleton } from "./preview";
import { apiGetConversationsWithDoctors, apiGetConversationsWithPatients } from "../api";

import { cn } from "@/utils";
import { getUser } from "@/features/profile/api";

export const List: React.FC = () => {
  const conversationsType = useConversationLayoutStore((store) => store.conversationsType);
  const { data: doctorInfo } = useQuery({
    queryKey: ["getUser"],
    queryFn: async () => getUser(),
  });

  const { data: conversations, isLoading } = useQuery({
    queryKey: ["conversations", conversationsType],
    queryFn: async () => {
      if (conversationsType === "patients") {
        return apiGetConversationsWithPatients();
      }
      if (doctorInfo) {
        return apiGetConversationsWithDoctors(doctorInfo.data.id);
      }
    },
    enabled: !!doctorInfo,
  });

  return (
    <div
      className={cn(
        "col-span-12 h-full w-full",
        "lg:col-span-5 lg:rounded-lg lg:border lg:border-neutral-200",
        "xl:col-span-4"
      )}
    >
      <div className="h-full space-y-0.5 overflow-y-auto p-2">
        {conversations?.map((conversation) => (
          <Preview
            key={conversation.id}
            conversation={conversation}
            typeConversation={conversationsType}
          />
        ))}

        {isLoading && Array.from({ length: 10 }).map((_, index) => <PreviewSkeleton key={index} />)}
      </div>
    </div>
  );
};
