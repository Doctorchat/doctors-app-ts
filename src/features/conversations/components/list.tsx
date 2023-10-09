import React from "react";

import { useQuery } from "react-query";

import { useConversationLayoutStore } from "./layout";
import { Preview, PreviewSkeleton } from "./preview";
import { apiGetConversationsWithPatients } from "../api";

import { cn } from "@/utils";
import { useChatList } from "../hooks/use-chat-list";
import { useSelector } from "react-redux";

export const List: React.FC = () => {
  const { isLoading } = useChatList();
  const { listChats } = useSelector((store: any) => ({
    listChats: store.listChats.data,
  }));

  return (
    <div
      className={cn(
        "col-span-12 h-full w-full",
        "lg:col-span-5 lg:rounded-lg lg:border lg:border-neutral-200",
        "xl:col-span-4"
      )}
    >
      <div className="h-full space-y-0.5 overflow-y-auto p-2">
        {listChats?.map((conversation: any) => (
          <Preview key={conversation.id} conversation={conversation} />
        ))}

        {isLoading && Array.from({ length: 10 }).map((_, index) => <PreviewSkeleton key={index} />)}
      </div>
    </div>
  );
};
