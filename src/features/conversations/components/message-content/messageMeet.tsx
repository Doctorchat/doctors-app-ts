import { useTranslation } from "react-i18next";
import clsx from "clsx";
import dayjs from "dayjs";

import ExternalIcon from "@/icons/external-link.svg";
import CamIcon from "@/icons/webcam.svg";
import date from "@/utils/date";
import { ConversationMessage } from "../../types";
import { LinkIcon, VideoCameraIcon } from "@heroicons/react/24/outline";
interface MessageMeetProps {
  message: ConversationMessage;
}
export const MessageMeet: React.FC<MessageMeetProps> = ({ message }) => {
  const { t } = useTranslation();
  const { url, time } = message.meet;
  const isLinkDisabled = message.status === "closed";

  return (
    <div className="message-meet">
      <div className="d-flex inline-flex">
        <div className="meet-icon">
          <VideoCameraIcon />
        </div>
        <div className="meet-caption ps-3">
          <h4 className="title">Online Meet</h4>
          <span className="meet-date">{date(dayjs(time).toDate()).full}</span>
        </div>
      </div>
      <div className="meet-url">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={clsx({ disabled: isLinkDisabled })}
        >
          {t("common:access_meet")} <LinkIcon />
        </a>
      </div>
    </div>
  );
};
