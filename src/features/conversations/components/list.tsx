import React from "react";

import { useQuery } from "react-query";

import { useConversationLayoutStore } from "./layout";
import { Preview, PreviewSkeleton } from "./preview";
import { apiGetConversationsWithDoctors, apiGetConversationsWithPatients } from "../api";

import { cn } from "@/utils";
import { getUser } from "@/features/profile/api";
import { useChatList } from "../hooks/use-chat-list";
import { useSelector } from "react-redux";

export const List: React.FC = () => {
  const conversationsType = useConversationLayoutStore((store) => store.conversationsType);
  const { data: doctorInfo } = useQuery({
    queryKey: ["getUser"],
    queryFn: async () => getUser(),
  });

  const { data: listDoctors, isLoading: isLodingListDoctors } = useQuery({
    queryKey: ["list-doctors", conversationsType],
    queryFn: async () => {
      if (doctorInfo) {
        return apiGetConversationsWithDoctors(doctorInfo.data.id);
      }
    },
    enabled: !!doctorInfo,
  });

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
        {conversationsType === "doctors"
          ? listDoctors?.map((conversationDoctor) => (
              <Preview
                key={conversationDoctor.id}
                conversation={conversationDoctor}
                typeConversation={conversationsType}
              />
            ))
          : listChats?.map((conversationPatient: any) => (
              <Preview
                key={conversationPatient.id}
                conversation={conversationPatient}
                typeConversation={conversationsType}
              />
            ))}

        {(isLoading || isLodingListDoctors) &&
          Array.from({ length: 10 }).map((_, index) => <PreviewSkeleton key={index} />)}
      </div>
    </div>
  );
};
