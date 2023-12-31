import React, { useCallback, useEffect } from "react";
import { Button } from "@/components/ui";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui";
import { useAppI18n } from "@/hooks";
import { AppLocale } from "@/types";
import { setUserLocale } from "../api";
import i18n from "@/lib/i18n";
import { Avatar } from "antd";

export interface ProfileChangeLangProps {
  isShortText?: boolean;
}

const langs: { [index: string]: string } = {
  ro: "Română",
  ru: "Русский",
  en: "English",
};

const langsShort: { [index: string]: string } = {
  ro: "RO",
  ru: "RU",
  en: "EN",
};

const ProfileChangeLang: React.FC<ProfileChangeLangProps> = ({ isShortText = false }) => {
  const { setLanguage } = useAppI18n();

  useEffect(() => {
    if (i18n.language === "en-US") setLanguage("en" as AppLocale);
  }, [i18n.language]);

  const changeLanguage = useCallback((lng: string) => {
    if (isShortText) {
      localStorage.setItem("i18nextLng", lng);
      setLanguage(lng as AppLocale);
      return;
    }
    setUserLocale(lng);
    localStorage.setItem("i18nextLng", lng);
    setLanguage(lng as AppLocale);
  }, []);

  return (
    <div className="mr-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="select-none px-2" variant="ghost">
            <Avatar
              size={18}
              shape="circle"
              src={`/img/countries/${i18n.language}.png`}
              className="mr-2"
            />
            {isShortText ? langsShort[i18n.language] : langs[i18n.language]}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="top" align="start">
          {Object.keys(langs).map((lng) => (
            <DropdownMenuItem
              className="flex items-center justify-evenly"
              key={lng}
              onClick={() => changeLanguage(lng)}
            >
              <Avatar size={18} shape="circle" src={`/img/countries/${lng}.png`} />
              {isShortText ? langsShort[lng] : langs[lng]}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export { ProfileChangeLang };
