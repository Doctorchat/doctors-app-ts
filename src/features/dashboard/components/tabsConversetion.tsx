import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui";
import { useTranslation } from "react-i18next";
import ChatsView from "../chats/chatsView";
import { TabsProps } from "../types";

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
      children: t("conversations:doctors"),
    },
  ];
  return (
    <div>
      <Tabs defaultValue="actualy_chats">
        <TabsList className="flex" aria-label="Partners tabs">
          {TAB_ITEMS.map(({ value, children }) => (
            <TabItem value={value} key={value}>
              {children}
            </TabItem>
          ))}
        </TabsList>

        <TabsContent value="actualy_chats">
          <ChatsView data={data?.open} loading={loading} />
        </TabsContent>
        <TabsContent className="grow rounded-b-md bg-white outline-none" value="chats_closed">
          <ChatsView data={data?.closed} loading={loading} />
        </TabsContent>
        <TabsContent className="grow rounded-b-md bg-white outline-none" value="doctors">
         <ChatsView data={[]} loading={loading} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
const TabItem = ({ children, value }: { children: React.ReactNode; value: string }) => {
  return (
    <TabsTrigger
      className="flex flex-1 cursor-pointer items-center justify-center bg-white px-5 py-3 text-sm text-primary hover:font-medium data-[state=active]:rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:font-bold data-[state=active]:text-primary"
      value={value}
    >
      {children}
    </TabsTrigger>
  );
};

export default TabsConversersional;
