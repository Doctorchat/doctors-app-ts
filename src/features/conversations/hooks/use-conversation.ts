import React from "react";
import { useSearchParams } from "react-router-dom";

import { useQuery } from "react-query";

import { apiGetConversation, apiGetUserCard } from "../api";

export const useConversation = () => {
  const [searchParams] = useSearchParams();
  const [id, setId] = React.useState<string | null>(null);
  const [isAnonymous, setIsAnonymous] = React.useState(false);

  const {
    data: conversation,
    isLoading: isConversationLoading,
    isError: isConversationErrored,
    refetch: refetchConversation,
  } = useQuery({
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
    refetch: refetchCard,
  } = useQuery({
    queryKey: ["user-card", conversation?.user_id],
    queryFn: async () => {
      if (conversation?.user_id) return apiGetUserCard(conversation.user_id, isAnonymous);
    },
    enabled: Boolean(conversation?.user_id),
  });

  React.useEffect(() => {
    if (searchParams.has("id")) setId(searchParams.get("id") ?? null);
    if (searchParams.has("anonymous")) setIsAnonymous(searchParams.get("anonymous") === "true");
  }, [searchParams]);

  return React.useMemo(
    () => ({
      id,
      setId,
      isAnonymous,
      setIsAnonymous,
      conversation,
      isConversationLoading,
      isConversationErrored,
      refetchConversation,
      card,
      isCardLoading,
      isCardErrored,
      refetchCard,
    }),
    [
      card,
      conversation,
      id,
      isAnonymous,
      isCardErrored,
      isCardLoading,
      isConversationErrored,
      isConversationLoading,
      refetchCard,
      refetchConversation,
    ],
  );
};
