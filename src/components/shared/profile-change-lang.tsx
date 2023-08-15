import React, { useCallback, useState } from "react";

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
  const [language, setLanguage] = useState(langs.ro);

  const changeLanguage = useCallback((lng: string) => {
    //   await api.user.changeLocale(lng);

    localStorage.setItem("i18nextLng", lng);
    i18n.changeLanguage(lng);
  }, []);

  return (
    <div className="mr-2 ">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="select-none" variant="ghost">
            <LanguageIcon className="h-5 w-5" /> &nbsp;
            {language}
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
