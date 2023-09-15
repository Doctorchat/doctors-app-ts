import React from "react";
import { cn } from "@/utils";
import { DashboardWrapper } from "./dashboard-wrapper";

export const View: React.FC = () => {
  const components = () => {
    return <DashboardWrapper />;
  };

  return <div className={cn(" h-full w-full")}>{components()}</div>;
};
