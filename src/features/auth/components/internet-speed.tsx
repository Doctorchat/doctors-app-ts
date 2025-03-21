import { Button } from "@/components/ui";
import React from "react";
import { ReactInternetSpeedMeter } from "react-internet-meter";
import "react-internet-meter/dist/index.css";

const OfflineImage = () => {
  return (
    <div className="_1alIC_disconnected">
      <img
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJAAAACQBAMAAAAVaP+LAAAAGFBMVEUAAABTU1NNTU1TU1NPT09SUlJSUlJTU1O8B7DEAAAAB3RSTlMAoArVKvVgBuEdKgAAAJ1JREFUeF7t1TEOwyAMQNG0Q6/UE+RMXD9d/tC6womIFSL9P+MnAYOXeTIzMzMzMzMzaz8J9Ri6HoITmuHXhISE8nEh9yxDh55aCEUoTGbbQwjqHwIkRAEiIaG0+0AA9VBMaE89Rogeoww936MQrWdBr4GN/z0IAdQ6nQ/FIpRXDwHcA+JIJcQowQAlFUA0MfQpXLlVQfkzR4igS6ENjknm/wiaGhsAAAAASUVORK5CYII="
        alt="offline"
      />
      <span className="_2Qem8">Diconnected from internet</span>
      <div className="reconect">
        <Button onClick={() => window.location.replace(window.location.origin)}>
          Reconnect to main page
        </Button>
      </div>
    </div>
  );
};

export const InternetSpeed: React.FC = () => {
  const [online, setOnline] = React.useState(navigator.onLine);

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
      txtSubHeading="Internet is too slow"
      outputType="alert"
      customClassName={null}
      txtMainHeading="Internet ..."
      pingInterval={4000}
      thresholdUnit="megabyte"
      threshold={15}
      imageUrl="/offline-1px.jpg"
      downloadSize="1781287"
    />
  ) : (
    <OfflineImage />
  );
};

export default InternetSpeed;
