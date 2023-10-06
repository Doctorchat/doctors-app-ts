import { useNavigate } from "react-router-dom";

import { useTranslation } from "react-i18next";
import { useMediaQuery } from "usehooks-ts";

import { View, useConversationLayoutStore } from "../components";
import { useConversation } from "../hooks";

import { Sheet, SheetContent } from "@/components/ui";
import { AddChatDoctors, useNewChatDoctors } from "../components/new-chat";

export default function ConversationPage() {
  const { t } = useTranslation();
  const { patientId, doctorId } = useConversation();

  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 1024px)");

  const setNewChatDoctors = useNewChatDoctors((store) => store.setOpen);

  const conversationsType = useConversationLayoutStore((store) => store.conversationsType);
  if (isMobile) {
    return (
      <Sheet open={Boolean(patientId ?? doctorId)} onOpenChange={() => navigate("/conversations")}>
        <SheetContent className="w-full p-0 sm:max-w-full">
          <View />
        </SheetContent>
      </Sheet>
    );
  }

  if ((patientId ?? doctorId) === null) {
    return (
      <div className="flex items-center justify-center rounded-lg border border-neutral-200 lg:col-span-7 xl:col-span-8">
        <p
          onClick={conversationsType === "doctors" ? () => setNewChatDoctors(true) : undefined}
          className={`${
            conversationsType === "doctors" ? "cursor-pointer" : ""
          } rounded-md bg-neutral-200 px-2 py-1 text-sm font-medium text-typography-primary`}
        >
          {conversationsType === "patients"
            ? t("conversations:select_conversation")
            : t("conversations:create_conversation")}
        </p>
        <AddChatDoctors />
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-neutral-200 bg-white lg:col-span-7 xl:col-span-8">
      <View />
    </div>
  );
}
