import { useTranslation } from "react-i18next";

export default function SelectConversationPage() {
  const { t } = useTranslation();

  return (
    <div className="hidden items-center justify-center rounded-lg border border-neutral-200 lg:col-span-7 lg:flex xl:col-span-8">
      <p className="rounded-md bg-neutral-200 px-2 py-1 text-sm font-medium text-typography-primary">
        {t("conversations:select_conversation")}
      </p>
    </div>
  );
}
