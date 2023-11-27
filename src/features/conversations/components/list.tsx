import React from "react";
import { useConversationLayoutStore } from "./layout";
import { Preview, PreviewSkeleton } from "./preview";
import { cn } from "@/utils";
import { useChatList } from "../hooks/use-chat-list";
import { useDispatch, useSelector } from "react-redux";
import { useChatListDoctors } from "../hooks/use-chat-list-doctors";
import { PreviewSearch } from "./preview-search";
import { ArchiveBoxXMarkIcon } from "@heroicons/react/24/outline";
import { t } from "i18next";
import { ChatNewPreview } from "./new-chat/chat-preview";
import { AddChatDoctors, useNewChatDoctors } from "./new-chat";
import usePusher from "../hooks/usePusher";
import {
  SOCKET_PUSHER_CHANNEL_DOCTOR_DOCTORS_LIST,
  SOCKET_PUSHER_CHANNEL_LIST_CHATS,
  SOCKET_PUSHER_EVENT_DOCTOR_DOCTORS_LIST,
  SOCKET_PUSHER_EVENT_LIST_CHATS,
} from "@/config";
import { updateListChatsDoctors } from "@/store/slices/listChatsDoctorsSlice";
import { updateListChats } from "@/store/slices/listChatsSlice";
import { Channel } from "pusher-js";

export const List: React.FC = () => {
  const conversationsType = useConversationLayoutStore((store) => store.conversationsType);
  const [searchText, setSearchText] = React.useState("");
  const [filteredConversations, setFilteredConversations] = React.useState([]);

  const { listChatsDoctors } = useSelector((store: any) => ({
    listChatsDoctors: store.listChatsDoctors.data,
  }));
  const { listChats } = useSelector((store: any) => ({
    listChats: store.listChats.data,
  }));

  const { listDoctors, isLoadingListDoctors, refetchingListDoctors } = useChatListDoctors();
  const { listPatients, isLoading, refetchingListPatients } = useChatList();

  React.useEffect(() => {
    refetchingListPatients();
  }, []);
  
  const sessionUser = localStorage.getItem("session:user") ?? "";

  const current_user = !!sessionUser ? JSON.parse(localStorage.getItem("session:user") || "") : "";
  const { pusher } = usePusher();
  const dispatch = useDispatch();
  React.useEffect(() => {
    let doctorsListChannel: Channel;
    let patientslistChannel: Channel;

    if (pusher) {
      doctorsListChannel = pusher.subscribe(
        SOCKET_PUSHER_CHANNEL_DOCTOR_DOCTORS_LIST + current_user.id
      );
      patientslistChannel = pusher.subscribe(SOCKET_PUSHER_CHANNEL_LIST_CHATS + current_user.id);
      doctorsListChannel.bind(SOCKET_PUSHER_EVENT_DOCTOR_DOCTORS_LIST, (data: any) => {
        const listMessage = JSON.parse(data.content_data);
        dispatch(
          updateListChatsDoctors({
            unreadCount: listMessage.unreadCount,
            chat_id: listMessage.doctor_chat_id,
            lastMessage: listMessage.message,
            updated_at: listMessage.updated_at,
          })
        );
      });

      patientslistChannel.bind(SOCKET_PUSHER_EVENT_LIST_CHATS, (data: any) => {
        const { chatList, chat_id } = data;
        const chat_update = JSON.parse(chatList);
        dispatch(updateListChats({ id: chat_id, updatedData: chat_update }));
      });
    }
    return () => {
      doctorsListChannel?.unsubscribe();
      patientslistChannel?.unsubscribe();
    };
  }, [pusher]);

  React.useEffect(() => {
    if (conversationsType === "doctors") {
      setFilteredConversations(listChatsDoctors.length ? listChatsDoctors : listDoctors ?? []);
    } else {
      setFilteredConversations(listChats.length ? listChats : listPatients ?? []);
    }
  }, [conversationsType, listChatsDoctors, listDoctors, listChats, listPatients]);

  const onSearchChat = (e: any) => {
    const searchValue = e.target.value;
    if (!!searchValue) {
      setSearchText(searchValue);

      let filteredList = [];
      if (conversationsType === "doctors") {
        filteredList = (listChatsDoctors.length ? listChatsDoctors : listDoctors).filter(
          (conversationDoctor: any) =>
            conversationDoctor.title.toLowerCase().includes(searchValue.toLowerCase())
        );
      } else {
        filteredList = (listChats.length ? listChats : listPatients).filter(
          (conversationPatient: any) =>
            conversationPatient.name.toLowerCase().includes(searchValue.toLowerCase())
        );
      }

      setFilteredConversations(filteredList);
    } else {
      if (conversationsType === "doctors") {
        setFilteredConversations(listChatsDoctors.length ? listChatsDoctors : listDoctors ?? []);
      } else {
        setFilteredConversations(listChats.length ? listChats : listPatients ?? []);
      }
    }
  };
  const setNewChatDoctors = useNewChatDoctors((store) => store.setOpen);
  return (
    <div
      className={cn(
        "col-span-12 h-full w-full",
        "lg:col-span-5 lg:rounded-lg lg:border lg:border-neutral-200",
        "xl:col-span-4"
      )}
    >
      <div className="px-2 pt-2">
        <PreviewSearch onSearch={onSearchChat} />
      </div>
      {conversationsType === "doctors" && <ChatNewPreview setNewChatDoctors={setNewChatDoctors} />}
      <div
        className="custom-scroll-bar  space-y-0.5 overflow-y-auto p-2"
        style={{
          height: conversationsType === "doctors" ? "calc(100% - 130px)" : "calc(100% - 50px)",
        }}
      >
        {isLoading || isLoadingListDoctors ? (
          Array.from({ length: 10 }).map((_, index) => <PreviewSkeleton key={index} />)
        ) : filteredConversations.length ? (
          filteredConversations.map((conversation: any) => (
            <Preview
              key={conversation.id}
              conversation={conversation}
              typeConversation={conversationsType}
            />
          ))
        ) : (
          <div className="mt-8 flex flex-col items-center justify-center">
            <ArchiveBoxXMarkIcon className="h-16 w-16 text-gray-400" />
            <h4 className="text-md mb-2 font-medium text-gray-400">{t("common:empty_list")}</h4>
          </div>
        )}
      </div>
      <AddChatDoctors />
    </div>
  );
};
