import React from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/utils";
import RepeatedConsultationForm from "./repeated-consultation-form";


export const View: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className={cn("col-span-12 md:col-span-8 xl:col-span-4 h-full w-full md:rounded-lg md:border md:border-neutral-200 p-10 custom-scroll-bar")}>
      <div>
        <h6 className="mb-2 text-black font-medium">{t("consultation:repeated_consultations.description")}</h6>
        <p className="mb-4">{t("consultation:repeated_consultations.note")}</p>
        <p className="mb-4">{t("consultation:repeated_consultations.warning")}</p>
        <RepeatedConsultationForm />
      </div>
    </div>
  );
};
