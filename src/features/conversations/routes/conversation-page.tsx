import { useNavigate } from "react-router-dom";

import { useTranslation } from "react-i18next";
import { useMediaQuery } from "usehooks-ts";

import { View } from "../components";
import { useConversation } from "../hooks";

import { Sheet, SheetContent } from "@/components/ui";

export default function ConversationPage() {
  const { t } = useTranslation();
  const { id } = useConversation();

  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 1024px)");

  if (isMobile) {
    return (
      <Sheet open={Boolean(id)} onOpenChange={() => navigate("/conversations")}>
        <SheetContent className="w-full p-0 sm:max-w-full">
          <View />
        </SheetContent>
      </Sheet>
    );
  };

  if (id === null) {
    return (
      <div className="flex items-center justify-center rounded-lg border border-neutral-200 lg:col-span-7 xl:col-span-8">
        <p className="rounded-md bg-neutral-200 px-2 py-1 text-sm font-medium text-typography-primary">
          {t("conversations:select_conversation")}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-neutral-200 bg-white lg:col-span-7 xl:col-span-8">
      <View />
    </div>
  );
}
