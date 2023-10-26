import React from "react";
import { useConversationLayoutStore } from "./layout";
import { Preview, PreviewSkeleton } from "./preview";
import { cn } from "@/utils";
import { useChatList } from "../hooks/use-chat-list";
import { useSelector } from "react-redux";
import { useChatListDoctors } from "../hooks/use-chat-list-doctors";
import { PreviewSearch } from "./preview-search";
import { ArchiveBoxXMarkIcon } from "@heroicons/react/24/outline";
import { t } from "i18next";

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
  const { listDoctors, isLoadingListDoctors } = useChatListDoctors();
  const { listPatients, isLoading } = useChatList();

  React.useEffect(() => {
    // La încărcarea inițială, afișați toate conversațiile în funcție de valoarea typeConversation
    if (conversationsType === "doctors") {
      console.log(listChatsDoctors.length ? listChatsDoctors : listDoctors ?? []);
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
        console.log(listChatsDoctors.length ? listChatsDoctors : listDoctors);
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
        console.log(listChatsDoctors.length ? listChatsDoctors : listDoctors ?? []);
        setFilteredConversations(listChatsDoctors.length ? listChatsDoctors : listDoctors ?? []);
      } else {
        setFilteredConversations(listChats.length ? listChats : listPatients ?? []);
      }
    }
  };

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
      <div
        className="custom-scroll-bar  space-y-0.5 overflow-y-auto p-2"
        style={{ height: "calc(100% - 50px)" }}
      >
        {/* {conversationsType === "doctors"
          ? (listChatsDoctors?.length ? listChatsDoctors : listDoctors)?.map(
              (conversationDoctor: any) => (
                <Preview
                  key={conversationDoctor.id}
                  conversation={conversationDoctor}
                  typeConversation={conversationsType}
                />
              )
            )
          : (listChats?.length ? listChats : listPatients)?.map((conversationPatient: any) => (
              <Preview
                key={conversationPatient.id}
                conversation={conversationPatient}
                typeConversation={conversationsType}
              />
            ))} */}
        {(isLoading || isLoadingListDoctors) &&
          Array.from({ length: 10 }).map((_, index) => <PreviewSkeleton key={index} />)}
        {filteredConversations.length ? (
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
    </div>
  );
};
