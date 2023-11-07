import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

interface PreviewProps {
  setNewChatDoctors: (open: boolean) => void;
}

export const ChatNewPreview: React.FC<PreviewProps> = ({ setNewChatDoctors }) => {
  const { t } = useTranslation();

  return (
    <div className="rounded-lg p-2">
      <div
        className="flex h-16 cursor-pointer items-center rounded-lg border border-sky-600 bg-sky-50 p-3 active:bg-sky-100 md:hover:bg-sky-100"
        onClick={() => setNewChatDoctors(true)}
      >
        <div className=" flex-1 overflow-hidden">
          <div className="flex items-center overflow-hidden">
            <PlusCircleIcon height={48} width={48} color="#0284c7" />
            <div className="flex flex-1 items-center overflow-hidden">
              <p className=" text-lg font-medium text-sky-600">
                {t("conversations:create_chat_doc")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
