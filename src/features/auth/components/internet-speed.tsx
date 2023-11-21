import React from "react";
import { useTranslation } from "react-i18next";
import { ReactInternetSpeedMeter } from "react-internet-meter";
import "react-internet-meter/dist/index.css";

const OfflineImage = () => {
  const { t } = useTranslation();
  return (
    <div className="_1alIC null">
      <span className="_nqCmj">{t("validations:net_title")}</span>
      <span className="_2Qem8">{t("validations:net_disconeted")}</span>
    </div>
  );
};

export const InternetSpeed: React.FC = () => {
  const { t } = useTranslation();
  const [wifiSpeed, setwifiSpeed] = React.useState("Checking ... ");
  const [online, setOnline] = React.useState(navigator.onLine);
  console.log(wifiSpeed);
  React.useEffect(() => {
    const updateOnlineStatus = () => setOnline(navigator.onLine);

    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);

    return () => {
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
    };
  }, []);

  return online ? (
    <ReactInternetSpeedMeter
      txtSubHeading={t("validations:net_slow")}
      outputType="alert"
      customClassName={null}
      txtMainHeading={t("validations:net_title")}
      pingInterval={4000}
      thresholdUnit="megabyte"
      threshold={5}
      imageUrl="/offline.jpg"
      downloadSize="1781287"
      callbackFunctionOnNetworkDown={(speed: any) => console.log(`Internet speed is down ${speed}`)}
      callbackFunctionOnNetworkTest={(speed: any) => setwifiSpeed(speed)}
    />
  ) : (
    <OfflineImage />
  );
};

export default InternetSpeed;
