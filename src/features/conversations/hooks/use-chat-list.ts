import React from "react";
import { useQuery } from "react-query";
import { useConversationLayoutStore } from "../components/layout";
import { apiGetConversationsWithPatients } from "../api";
import { addListChats } from "@/store/slices/listChatsSlice";
import { useDispatch, useSelector } from "react-redux";
import { sortChatsByUpdatedAt } from "@/utils/sort-list";

export const useChatList = () => {
  const conversationsType = useConversationLayoutStore((store) => store.conversationsType);
  const dispatch = useDispatch();

  const {
    data: dataListPacients,
    isLoading,
    refetch: refetchingListPatients,
  } = useQuery({
    queryKey: ["list-patients", conversationsType],
    queryFn: async () => {
      return apiGetConversationsWithPatients();
    },
    onSuccess: (data) => {
      if (data) return dispatch(addListChats(data));
    },
  });
  const listPatients = React.useMemo(() => {
    return dataListPacients && sortChatsByUpdatedAt(dataListPacients);
  }, [dataListPacients]);

  return React.useMemo(
    () => ({ listPatients, isLoading, refetchingListPatients }),
    [listPatients, isLoading, refetchingListPatients]
  );
};
