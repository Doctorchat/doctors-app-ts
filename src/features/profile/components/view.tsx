import React from "react";
import { cn } from "@/utils";
import { PersonalData } from ".";
import { useProfileLayoutStore } from "./layout";
import { Options } from "./options";
import { Security } from "./security";

export const View: React.FC = () => {
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
        "custom-scroll-bar h-full w-full p-4 md:rounded-lg md:border md:border-neutral-200 md:p-10"
      )}
    >
      {components()}
    </div>
  );
};
