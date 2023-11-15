import { useTranslation } from "react-i18next";
import { ConversationPreview } from "../types";
import { Badge } from "@/components/ui";
type StatusMap = {
  [key in "closed" | "open" | "responded"]: {
    variant: "primary" | "progress" | "success";
    message: string;
  };
};
interface BadgeProps {
  conversation: ConversationPreview;
  typeConversation: "patients" | "doctors" | "closed";
}
export const BadgeType: React.FC<BadgeProps> = ({ typeConversation, conversation }) => {
  const { t } = useTranslation();
  const statusMap: StatusMap = {
    closed: { variant: "primary", message: t("conversations:chat_closed") },
    open: { variant: "progress", message: t("conversations:chat_open") },
    responded: { variant: "success", message: t("conversations:chat_responded") },
  };

  if (typeConversation !== "patients" || conversation.type === "support") {
    return null;
  }

  const { isAccepted, status } = conversation;
  const { variant, message } = statusMap[status as keyof typeof statusMap] || {};
  if (!isAccepted && status !=="closed") {
    return (
      <Badge variant="destructive" className="ml-1 whitespace-nowrap px-2 py-px">
        {t("conversations:chat_not_accept")}
      </Badge>
    );
  }

  return variant && message ? (
    <Badge
      variant={
        variant as
          | "primary"
          | "progress"
          | "success"
          | "default"
          | "secondary"
          | "destructive"
          | "outline"
      }
      className="ml-1 whitespace-nowrap px-2 py-px"
    >
      {message}
    </Badge>
  ) : null;
};
