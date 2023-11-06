import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui";
import { useTranslation } from "react-i18next";
import ChatsView from "../chats/chatsView";
import { IChats, TabsProps } from "../types";
import { sortChatsByUpdatedDoctor, sortChatsByUpdatedOpen } from "@/utils/sort-list";
import { useSelector } from "react-redux";
import { useMemo } from "react";
import { ConversationPreview } from "@/features/conversations/types";

const TabsConversersional: React.FC<TabsProps> = ({ loading, data }) => {
  const { t } = useTranslation();
  const TAB_ITEMS = [
    {
      value: "actualy_chats",
      children: t("conversations:actualy_chats"),
    },
    {
      value: "chats_closed",
      children: t("conversations:chats_closed"),
    },
    {
      value: "doctors",
      children: t("conversations:doctors_chats"),
    },
  ];

  type RootState = {
    listsChatsShorts: {
      listPatients: ConversationPreview[];
      listClosed: ConversationPreview[];
      listDoctors: ConversationPreview[];
    };
  };

  const { patients, closed, doctors } = useSelector((store: RootState) => ({
    patients: store.listsChatsShorts.listPatients,
    closed: store.listsChatsShorts.listClosed,
    doctors: store.listsChatsShorts.listDoctors,
  }));

  return (
    <div className="custom-scroll-bar h-full w-full rounded-lg border p-1 md:rounded-lg md:border md:border-neutral-200 md:border-neutral-200">
      <Tabs defaultValue="actualy_chats">
        <TabsList className="flex" aria-label="Partners tabs">
          {TAB_ITEMS.map(({ value, children }) => (
            <TabItem value={value} key={value}>
              {children}
            </TabItem>
          ))}
        </TabsList>

        <TabsContent value="actualy_chats">
          <ChatsView data={sortChatsByUpdatedOpen(patients ?? [])} loading={loading} />
        </TabsContent>
        <TabsContent className="grow rounded-b-md bg-white outline-none" value="chats_closed">
          <ChatsView data={sortChatsByUpdatedOpen(closed ?? [])} loading={loading} />
        </TabsContent>
        <TabsContent className="grow rounded-b-md bg-white outline-none" value="doctors">
          <ChatsView data={sortChatsByUpdatedOpen(doctors ?? [])} loading={loading} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
const TabItem = ({ children, value }: { children: React.ReactNode; value: string }) => {
  return (
    <TabsTrigger
      className="flex flex-1 cursor-pointer items-center justify-center bg-white px-0 py-3 text-sm text-primary hover:font-medium data-[state=active]:rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:font-bold data-[state=active]:text-primary"
      value={value}
    >
      <p className="truncate">{children}</p>
    </TabsTrigger>
  );
};

export default TabsConversersional;
