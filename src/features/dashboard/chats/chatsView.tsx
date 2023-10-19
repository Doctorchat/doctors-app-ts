import React from "react";
import { ChatsProps } from "../types";
import { PreviewSkeleton } from "@/features/conversations/components/preview";
import { Preview } from "./preview";
import { useTranslation } from "react-i18next";

const ChatsView: React.FC<ChatsProps> = ({ loading, data }) => {
  const { t } = useTranslation();
  return (
    <div className="grid overflow-hidden">
      <div className=" overflow-hidden">
        <div className="h-full space-y-0.5 overflow-y-auto p-2">
          {data?.map((conversation) => (
            <Preview key={conversation.id} conversation={conversation} />
          ))}
          {loading && Array.from({ length: 10 }).map((_, index) => <PreviewSkeleton key={index} />)}
          {!data?.length && (
            <div className="flex justify-center	">{t("conversations:no_conversations")}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatsView;
