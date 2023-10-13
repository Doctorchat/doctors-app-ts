import { useTranslation } from "react-i18next";
import { ConversationMessage } from "../../types";
import Timeline from "@/components/ui/Timeline";
import { HiOutlineChatAlt } from "react-icons/hi";

interface MessageSurveyProps {
  message: ConversationMessage;
}
export const MessageSurvey: React.FC<MessageSurveyProps> = ({ message }) => {
  const { t } = useTranslation();
  if (message.type !== "answer") return null;
  const contentMessage = message.content && JSON.parse(message.content);

  return (
    <div>
      <Timeline>
        {contentMessage.map(({ doctor, patient }: any) => (
          <>
            <Timeline.Item
              className="color-[#e9ecef]"
              media={<HiOutlineChatAlt className="text-gray-400" />}
            >
              <p className="flex items-center">
                <span className="font-semibold text-gray-900 dark:text-gray-100">{doctor}</span>
              </p>
              <div className="py-2">
                <div className="ant-card ant-card-bordered rounded-lg border !border-gray-300 bg-white shadow-md">
                  <div className="ant-card-body p-3">
                    <p>{patient}</p>
                  </div>
                </div>
              </div>
            </Timeline.Item>
          </>
        ))}
      </Timeline>
    </div>
  );
};
