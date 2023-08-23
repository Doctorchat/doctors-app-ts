import { Checkbox, Label } from "@/components/ui";
import { useTranslation } from "react-i18next";
import v_chat from "../assets/v_chat.gif";
import c_chat from "../assets/c_chat.gif";

export const Options = () => {
  const { t } = useTranslation();
  return (
    <div>
      <h2 className="pb-4 text-xl font-bold text-black">{t("profile:options")}</h2>
      <div className="flex justify-start">
        <Label className="text-md  child-checked:border-green-500 mr-8 flex cursor-pointer flex-col items-center font-medium text-black">
          <img className="mb-4 h-48 w-80 rounded-lg" src={c_chat} alt="c_chat" />
          <span className="align-center label-checked:bg-red-600 flex">
            <span className="font-2xl pr-4 text-lg uppercase">{t("profile:chat_consult")}</span>
            <Checkbox className="h-6 w-6" />
          </span>
        </Label>
        <Label className="text-md flex cursor-pointer flex-col items-center font-medium text-black">
          <img className="mb-4 h-48 w-80 rounded-lg" src={v_chat} alt="v_chat" />
          <span className="align-center flex">
            <span className="font-2xl pr-4 text-lg uppercase">{t("profile:video_consult")}</span>
            <Checkbox className="v_chat h-6 w-6" />
          </span>
        </Label>
      </div>
    </div>
  );
};
