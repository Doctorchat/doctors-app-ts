import React from "react";
import { useQuery } from "react-query";
import { useConversationLayoutStore } from "../components/layout";
import { apiGetConversationsWithDoctors } from "../api";
import { useDispatch } from "react-redux";
import { getUser } from "@/features/profile/api";
import { addListChatsDoctors } from "@/store/slices/listChatsDoctorsSlice";
import { addDoctorInfo } from "@/store/slices/doctorInfoSlice";
import { sortChatsByUpdatedAt } from "@/utils/sort-list";

export const useChatListDoctors = () => {
  const conversationsType = useConversationLayoutStore((store) => store.conversationsType);
  const dispatch = useDispatch();
  const { data: doctorInfo } = useQuery({
    queryKey: ["getUser"],
    queryFn: async () => getUser(),
    onSuccess: (data: any) => {
      if (data) return dispatch(addDoctorInfo(data));
    },
  });

  const { data: dataListDoctors, isLoading: isLoadingListDoctors } = useQuery({
    queryKey: ["list-doctors", conversationsType],
    queryFn: async () => {
      if (doctorInfo) return apiGetConversationsWithDoctors(doctorInfo.id);
    },
    enabled: !!doctorInfo,
    onSuccess: (data: any) => {
      if (data) return dispatch(addListChatsDoctors(data));
    },
  });
  const listDoctors = React.useMemo(() => {
    return dataListDoctors && sortChatsByUpdatedAt(dataListDoctors);
  }, [dataListDoctors]);

  return React.useMemo(
    () => ({ listDoctors, isLoadingListDoctors }),
    [listDoctors, isLoadingListDoctors]
  );
};
