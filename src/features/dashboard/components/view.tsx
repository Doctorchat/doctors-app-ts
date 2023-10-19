import React from "react";
import { cn } from "@/utils";
import { DashboardWrapper } from "./dashboard";

export const View: React.FC = () => {
  const components = () => {
    return <DashboardWrapper />;
  };

  return (
    <div
      className={cn(
        "custom-scroll-bar grid h-full w-full gap-2  sm:grid-cols-1 md:grid-cols-2 md:rounded-lg lg:grid-flow-col lg:grid-cols-3 lg:grid-rows-1 xl:grid-flow-col xl:grid-cols-3 xl:grid-rows-1 p-0"
      )}
    >
      {components()}
    </div>
  );
};
