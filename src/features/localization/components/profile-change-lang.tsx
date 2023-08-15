import React, { useCallback, useEffect, useState } from "react";

import { LanguageIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui";
import { cn } from "@/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui";
import { useAppI18n } from "@/hooks";
import { AppLocale } from "@/types";
import { setUserLocale } from "../api";

export interface ProfileChangeLangProps {
  disabled?: boolean;
}

const langs: { [index: string]: string } = {
  ro: "Română",
  ru: "Русский",
  en: "English",
};

const ProfileChangeLang: React.FC<ProfileChangeLangProps> = ({ disabled }) => {
  const { t, i18n } = useTranslation();
  const [stateLanguage, setStateLanguage] = useState(langs.ro);
  const { setLanguage } = useAppI18n();

  const changeLanguage = useCallback((lng: string) => {
    setUserLocale(lng);
    setStateLanguage(langs[lng]);
    localStorage.setItem("i18nextLng", lng);
    setLanguage(lng as AppLocale);
  }, []);

  useEffect(() => {
    const user = localStorage.getItem("session:user");
    if (user) {
      setStateLanguage(langs[JSON.parse(user).locale]);
    }
  }, []);

  return (
    <div className="mr-2 ">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="select-none" variant="ghost">
            <LanguageIcon className="h-5 w-5" /> &nbsp;
            {stateLanguage}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="top" align="start">
          {Object.keys(langs).map((lng) => (
            <DropdownMenuItem key={lng} onClick={() => changeLanguage(lng)}>
              {langs[lng]}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export { ProfileChangeLang };
