import React, { useCallback } from "react";

import { LanguageIcon } from "@heroicons/react/24/outline";

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
  disabled?: boolean;
}

const langs: { [index: string]: string } = {
  ro: "Română",
  ru: "Русский",
  en: "English",
};

const ProfileChangeLang: React.FC<ProfileChangeLangProps> = ({ disabled }) => {
  const { setLanguage } = useAppI18n();

  const changeLanguage = useCallback((lng: string) => {
    setUserLocale(lng);
    localStorage.setItem("i18nextLng", lng);
    setLanguage(lng as AppLocale);
  }, []);

  return (
    <div className="mr-2 ">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="select-none px-2" variant="ghost">
            <Avatar
              size={18}
              shape="circle"
              src={`/img/countries/${i18n.language}.png`}
              className="mr-2"
            />
            {langs[i18n.language]}
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
              {langs[lng]}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export { ProfileChangeLang };
