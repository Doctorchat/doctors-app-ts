import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "usehooks-ts";
import { View, useConversationLayoutStore } from "../components";
import { useConversation } from "../hooks";
import { Button, Sheet, SheetContent } from "@/components/ui";
import { AddChatDoctors, useNewChatDoctors } from "../components/new-chat";

import React from "react";
import QrCodeFull from "../components/qr-code";

export default function ConversationPage() {
  const { t } = useTranslation();
  const { patientId, doctorId } = useConversation();
  const [parteneryQr, setParteneryQr] = React.useState<string>("");
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 1024px)");
  const [searchParams] = useSearchParams();
  const setNewChatDoctors = useNewChatDoctors((store) => store.setOpen);
  const conversationsType = useConversationLayoutStore((store) => store.conversationsType);
  const currentPage = searchParams.has("patientId")
    ? "patients"
    : searchParams.has("doctorId")
    ? "doctors"
    : "";

  if (isMobile) {
    return (
      <Sheet open={Boolean(patientId ?? doctorId)} onOpenChange={() => navigate("/conversations")}>
        <SheetContent className="w-full p-0 sm:max-w-full">
          <View />
        </SheetContent>
      </Sheet>
    );
  }
  if ((patientId ?? doctorId) === null || (currentPage && conversationsType !== currentPage)) {
    return (
      <div className="flex items-center justify-center rounded-lg border border-neutral-200 lg:col-span-7 xl:col-span-8">
        {conversationsType === "doctors" ? (
          <Button
            size="default"
            className="xs:hover:bg-primary-hover bg-primary  hover:bg-primary-hover sm:hover:bg-primary-hover md:hover:bg-primary-hover"
            onClick={() => setNewChatDoctors(true)}
          >
            {t("conversations:create_conversation")}
          </Button>
        ) : (
          <QrCodeFull />
        )}
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
