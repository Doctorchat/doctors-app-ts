import React from "react";
import { useTranslation } from "react-i18next";
import { UseQueryResult, useQuery } from "react-query";
import { getPartners } from "../../api";
import { Button, Skeleton } from "@/components/ui";
import { PartnerData } from "../../types";
import Notification from "@/components/ui/notification";

const PartnersSettingsFallback: React.FC = React.memo(() => {
  return (
    <>
      <Skeleton className="w-full h-24" />
    </>
  );
});

const PartnersSettings: React.FC = () => {
  const { t } = useTranslation();
  const [openNotification, setOpenNotification] = React.useState<boolean>(false);

  const {
    data: partnersData,
    isLoading
  } = useQuery<PartnerData, Error>(
    ["partners"],
    () => getPartners(),
    {
      keepPreviousData: true,
    }
  ) as UseQueryResult<PartnerData, Error>;

  if (isLoading || !partnersData) {
    return <PartnersSettingsFallback />;
  };

  const { partner_qr } = partnersData;

  const onClickQrButton = () => {
    const link = document.createElement("a");
    link.href = partner_qr;
    link.download = "qr.png";
    link.click();
  };

  const onClickCopyReferalLink = () => {
    navigator.clipboard.writeText(partnersData!.partner_url);
    setOpenNotification(true);
    setTimeout(() => {
      setOpenNotification(false);
    }, 3000);
  };

  return (
    <>
      <div className="flex flex-col space-y-4">
        <div
          className="relative"
        >
          <img src={partner_qr} alt="qr" />
          <Button
            size="sm"
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-primary hover:bg-primary-hover xs:hover:bg-primary-hover sm:hover:bg-primary-hover md:hover:bg-primary-hover px-3 py-2"
            onClick={onClickQrButton}
          >
            {t("partners:download_qr")}
          </Button>
        </div>

        <div className="w-full">
          <Button
            className="w-full bg-primary hover:bg-primary-hover xs:hover:bg-primary-hover sm:hover:bg-primary-hover md:hover:bg-primary-hover px-3 py-2"
            disabled={isLoading}
            onClick={onClickCopyReferalLink}
          >
            {t("partners:copy_referral_link")}
          </Button>
        </div>
      </div>

      <Notification
        open={openNotification ? true : false}
        onOpenChange={setOpenNotification.bind(null, false)}
        type={"success"}
        description={t("partners:copied_description")}
      />
    </>
  );
};

export default PartnersSettings;