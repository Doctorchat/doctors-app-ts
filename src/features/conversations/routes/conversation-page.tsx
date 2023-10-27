import { useNavigate, useSearchParams } from "react-router-dom";

import { useTranslation } from "react-i18next";
import { useMediaQuery } from "usehooks-ts";

import { View, useConversationLayoutStore } from "../components";
import { useConversation } from "../hooks";

import { Button, Sheet, SheetContent } from "@/components/ui";
import { AddChatDoctors, useNewChatDoctors } from "../components/new-chat";
import { useQuery } from "react-query";
import { getPartners } from "@/features/partners/api";
import { useEffect } from "react";
import React from "react";
import { Skeleton } from "antd";
import { saveAs } from "file-saver";

export default function ConversationPage() {
  const { t } = useTranslation();
  const { patientId, doctorId } = useConversation();
  const [parteneryQr, setParteneryQr] = React.useState<string>("");
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 1024px)");
  const [searchParams] = useSearchParams();
  const setNewChatDoctors = useNewChatDoctors((store) => store.setOpen);
  const { data: partnersData, isLoading } = useQuery<any>(["partners"], () => getPartners(), {
    keepPreviousData: true,
  });

  useEffect(() => {
    if (partnersData) {
      const { partner_qr } = partnersData;
      setParteneryQr(partner_qr);
    }
  }, [isLoading, parteneryQr]);

  const [imageLoaded, setImageLoaded] = React.useState(false);
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

  const handleImageLoad = (e: any) => {
    console.log(e);
    // debugger;

      setImageLoaded(true);
 

    // setImageLoaded(true);
  };
  const onClickCopyReferalLink = () => {
    // navigator.clipboard.writeText(partnersData!.partner_url);
    // setOpenNotification(true);
    // setTimeout(() => {
    //   setOpenNotification(false);
    // }, 3000);
  };

  // console.log(parteneryQr);
  const onClickQrButton = () => {
    window.open(parteneryQr, "_blank");
    saveAs(parteneryQr, "qr.png");
  };
  // console.log(imageLoaded);

  useEffect(() => {
    setImageLoaded(false);
    const img = new Image();
    img.src = parteneryQr;

    img.onload = () => {
      if (parteneryQr) {
       
          setImageLoaded(true);

      }
      console.log(parteneryQr);
    };
  }, [conversationsType, parteneryQr]);

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
          <div className="flex w-52 flex-col space-y-4">
            <div className="relative h-2/3">
              <div className="h-32 w-52 bg-white">
                {!imageLoaded ? (
                  <Skeleton className="xs:w-[100%] mx-auto my-0 h-auto w-[100%] sm:w-[100%] md:w-[60%] lg:w-[60%] xl:w-[60%]" />
                ) : (
                  <div className="h-32	w-52">
                    <img
                      src={parteneryQr}
                      alt="qr"
                      onLoad={handleImageLoad}
                      onLoadStart={() => setImageLoaded(false)}
                      className="xs:w-[100%] mx-auto my-0 h-auto w-[100%] sm:w-[100%] md:w-[60%] lg:w-[60%] xl:w-[60%]"
                    />
                  </div>
                )}
              </div>
              <Button
                size="sm"
                className="xs:hover:bg-primary-hover absolute bottom-0 left-1/2 -translate-x-1/2 transform bg-primary px-3 py-2 hover:bg-primary-hover sm:hover:bg-primary-hover md:hover:bg-primary-hover"
                onClick={onClickQrButton}
              >
                {t("partners:download_qr")}
              </Button>
            </div>

            <div className="h-1/3 w-full">
              <Button
                className="xs:hover:bg-primary-hover w-full bg-primary px-3 py-2 hover:bg-primary-hover sm:hover:bg-primary-hover md:hover:bg-primary-hover"
                disabled={isLoading}
                onClick={onClickCopyReferalLink}
              >
                {t("partners:copy_referral_link")}
              </Button>
            </div>
          </div>
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
