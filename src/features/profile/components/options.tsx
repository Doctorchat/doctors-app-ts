import { Checkbox, Label } from "@/components/ui";
import { useTranslation } from "react-i18next";
import v_chat from "../assets/v_chat.gif";
import c_chat from "../assets/c_chat.gif";
import { toggleChatConversations, toggleVideoChatConversations } from "../api";
import { useEffect, useState } from "react";
import { useAuth } from "@/features/auth";

export const Options = () => {
  const { t } = useTranslation();

  const [userData, setUserData] = useState({
    chat: false,
    video: false,
  });

  const { session } = useAuth();

  useEffect(() => {
    setUserData({ chat: session.user?.chat ?? false, video: session.user?.video ?? false });
  }, []);

  const updateData = async (action: () => Promise<any>) => {
    try {
      const res = await action();
      if (res) {
        const userStorage = localStorage.getItem("session:user");
        if (userStorage) {
          var user = JSON.parse(userStorage) || {};
          user.video = res?.video;
          user.chat = res?.chat;
          localStorage.setItem("session:user", JSON.stringify(user));
        }
      }
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  const toggleOptions = (
    option: string,
    checked: string | boolean,
    action: () => Promise<{ data: any }>
  ) => {
    setUserData({ ...userData, [option]: checked });
    updateData(action);
  };

  const options = [
    {
      image: c_chat,
      name: t("profile:chat_consult"),
      action: (checked: string | boolean) =>
        toggleOptions("chat", checked, toggleChatConversations),
      checked: userData.chat,
    },
    {
      image: v_chat,
      name: t("profile:video_consult"),
      action: (checked: string | boolean) =>
        toggleOptions("video", checked, toggleVideoChatConversations),
      checked: userData.video,
    },
  ];

  return (
    <div>
      <h2 className="hidden pb-4 text-xl font-bold text-black md:block">{t("profile:options")}</h2>
      <div className="flex flex-col justify-between sm:flex-row sm:justify-start">
        {options.map((opt) => (
          <Label
            key={opt.name}
            className="text-md child-checked:border-green-500 mb-8 flex cursor-pointer flex-col items-center font-medium text-black md:mb-0 md:mr-8"
          >
            <img className="mb-4 h-48 w-80 rounded-lg" src={opt.image} alt="c_chat" />
            <span className="align-center label-checked:bg-red-600 flex">
              <span className="font-2xl pr-4 text-lg uppercase">{opt.name}</span>
              <Checkbox
                checked={opt.checked}
                onCheckedChange={(checked) => opt.action(checked)}
                className="h-6 w-6"
              />
            </span>
          </Label>
        ))}
      </div>
    </div>
  );
};
