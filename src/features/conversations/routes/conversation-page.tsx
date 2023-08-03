import { useParams } from "react-router-dom";

import { useQuery } from "react-query";

import { apiGetConversation, apiGetUserCard } from "../api";
import { Header } from "../components";

import { cn } from "@/utils";

export default function ConversationPage() {
  const { id } = useParams<{ id: string }>();

  const { data: conversation } = useQuery({
    queryKey: ["conversation", id],
    queryFn: async () => {
      if (id) return apiGetConversation(id);
    },
    enabled: Boolean(id),
  });

  const {
    data: card,
    isLoading: isCardLoading,
    isError: isCardErrored,
  } = useQuery({
    queryKey: ["user-card", conversation?.user_id],
    queryFn: async () => {
      if (conversation?.user_id) return apiGetUserCard(conversation.user_id, false);
    },
    enabled: Boolean(conversation?.user_id),
  });

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 bg-white",
        { "slide-in-right": Boolean(id) },
        "lg:static lg:col-span-7 lg:rounded-lg lg:border lg:border-neutral-200 xl:col-span-8",
      )}
    >
      <div className="flex h-full flex-col">
        <Header
          card={card}
          isLoading={isCardLoading || (!conversation?.user_id && !isCardErrored)}
        />
      </div>
    </div>
  );
}
