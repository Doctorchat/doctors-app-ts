import React from "react";
import { useConversationLayoutStore } from "./layout";
import { Preview, PreviewSkeleton } from "./preview";
import { cn } from "@/utils";
import { useChatList } from "../hooks/use-chat-list";
import { useSelector } from "react-redux";
import { useChatListDoctors } from "../hooks/use-chat-list-doctors";

export const List: React.FC = () => {
  const conversationsType = useConversationLayoutStore((store) => store.conversationsType);
  const { listDoctors, isLoadingListDoctors } = useChatListDoctors();
  const { listPatients, isLoading } = useChatList();
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
          ? listDoctors?.map((conversationDoctor: any) => (
              <Preview
                key={conversationDoctor.id}
                conversation={conversationDoctor}
                typeConversation={conversationsType}
              />
            ))
          : listPatients?.map((conversationPatient: any) => (
              <Preview
                key={conversationPatient.id}
                conversation={conversationPatient}
                typeConversation={conversationsType}
              />
            ))}

        {(isLoading || isLoadingListDoctors) &&
          Array.from({ length: 10 }).map((_, index) => <PreviewSkeleton key={index} />)}
      </div>
    </div>
  );
};
