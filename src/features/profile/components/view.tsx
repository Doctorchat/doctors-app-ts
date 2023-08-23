import React, { useEffect, useState } from "react";

import { useTranslation } from "react-i18next";
import { useAppI18n } from "@/hooks";
import { Skeleton } from "@/components/ui";
import { useQuery } from "react-query";
import { cn } from "@/utils";
import { AxiosError } from "axios";
import { IUser } from "../types";
import { PersonalData } from ".";
import { useProfileLayoutStore } from "./layout";
import { Options } from "./options";
import { Security } from "./security";

export const View: React.FC = () => {
  const { t } = useTranslation();

  const components = () => {
    const profileLayout = useProfileLayoutStore((store) => store.profileLayout);

    switch (profileLayout) {
      case "personal_info":
        return <PersonalData />;
      case "options":
        return <Options />;
      case "security":
        return <Security />;
      default:
        return <PersonalData />;
    }
  };

  return (
    <div
      className={cn(
        "custom-scroll-bar h-full w-full p-10 md:rounded-lg md:border md:border-neutral-200"
      )}
    >
      {components()}
    </div>
  );
};
