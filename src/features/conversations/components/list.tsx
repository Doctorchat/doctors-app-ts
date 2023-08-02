import React from "react";

import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";

import { ConversationPreview, ConversationPreviewSkeleton } from "./preview";
import { getConversationsWithPatients } from "../api";

import { ScrollArea, Tabs, TabsList, TabsTrigger } from "@/components/ui";
import { cn } from "@/utils";

export interface ConversationsListProps extends React.HTMLAttributes<HTMLDivElement> {}

export const ConversationsList: React.FC<ConversationsListProps> = ({ className, ...props }) => {
  const { t } = useTranslation();

  const [activeTab, setActiveTab] = React.useState<"patients" | "doctors">("patients");

  const { data: conversations, isLoading } = useQuery({
    queryKey: ["conversations", activeTab],
    queryFn: async () => {
      return getConversationsWithPatients();
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
        <header className="flex items-center justify-between overflow-hidden px-5 pb-3 pt-5">
          <h1 className="truncate text-lg font-medium text-typography-primary">
            {t("conversations:recent_conversations")}
          </h1>
          <Tabs
            defaultValue={activeTab}
            onValueChange={(value) => setActiveTab(value as "patients" | "doctors")}
            className="ml-2"
          >
            <TabsList>
              <TabsTrigger value="patients">{t("conversations:patients")}</TabsTrigger>
              <TabsTrigger disabled value="doctors">
                {t("conversations:doctors")}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </header>
        <div className="space-y-0.5 p-2">
          {conversations
            ?.sort((a, b) => new Date(b.updated).getTime() - new Date(a.updated).getTime())
            .map((conversation) => (
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
