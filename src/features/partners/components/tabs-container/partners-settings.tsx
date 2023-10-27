import React from "react";
import { useTranslation } from "react-i18next";
import { saveAs } from "file-saver";
import { UseQueryResult, useQuery } from "react-query";
import { getPartners } from "../../api";
import { Button, Skeleton } from "@/components/ui";
import { PartnerData } from "../../types";
import Notification from "@/components/ui/notification";
import { boolean } from "zod";
import { useWindowSize } from "usehooks-ts";

const PartnersSettingsFallback: React.FC = React.memo(() => {
  return <Skeleton className="h-24 w-full" />;
});
interface PartenersProps {
  screen?: boolean;
}

const PartnersSettings: React.FC<PartenersProps> = (props) => {
  const { t } = useTranslation();
  const [openNotification, setOpenNotification] = React.useState<boolean>(false);

  const { data: partnersData, isLoading } = useQuery<PartnerData, Error>(
    ["partners"],
    () => getPartners(),
    {
      keepPreviousData: true,
    }
  ) as UseQueryResult<PartnerData, Error>;

  if (isLoading || !partnersData) {
    return <PartnersSettingsFallback />;
  }

  const { partner_qr } = partnersData;

  const onClickQrButton = () => {
    window.open(partner_qr, "_blank");
    saveAs(partner_qr, "qr.png");
  };

  const onClickCopyReferalLink = () => {
    navigator.clipboard.writeText(partnersData!.partner_url);
    setOpenNotification(true);
    setTimeout(() => {
      setOpenNotification(false);
    }, 3000);
  };
  const { width } = useWindowSize();
  const xsStyles = { paddingBottom: "100%" };
  const smStyles = { paddingBottom: "100%" };
  const mdStyles = { paddingBottom: "60%" };
  const lgStyles = { paddingBottom: "60%" };
  const xlStyles = { paddingBottom: "60%" };
  let selectedStyles = xsStyles;
  if (width >= 1280) {
    selectedStyles = xlStyles;
  } else if (width >= 1024) {
    selectedStyles = lgStyles;
  } else if (width >= 768) {
    selectedStyles = mdStyles;
  } else if (width >= 640) {
    selectedStyles = smStyles;
  }
  return (
    <>
      <div className="flex flex-col space-y-4">
        <div className="relative flex justify-center" style={selectedStyles}>
          <img
            src={partner_qr}
            alt="qr"
            className="xs:w-[100%] absolute top-0 mx-auto my-0 h-auto h-full w-[100%] sm:w-[100%] md:w-[60%] lg:w-[60%] xl:w-[60%]"
          />
          <Button
            size="sm"
            className="xs:hover:bg-primary-hover absolute bottom-0 left-1/2 -translate-x-1/2 transform bg-primary px-3 py-2 hover:bg-primary-hover sm:hover:bg-primary-hover md:hover:bg-primary-hover"
            onClick={onClickQrButton}
          >
            {t("partners:download_qr")}
          </Button>
        </div>
        {/* </div> */}

        <div className="w-full">
          <Button
            className="xs:hover:bg-primary-hover w-full bg-primary px-3 py-2 hover:bg-primary-hover sm:hover:bg-primary-hover md:hover:bg-primary-hover"
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
