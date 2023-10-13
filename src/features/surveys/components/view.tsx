import React, { useEffect } from "react";
import { cn } from "@/utils";
import { Card, Tooltip } from "antd";
import TextEllipsis from "@/components/ui/textEllipsis";
import Button from "@/components/ui/buttonIcon";
import { HiOutlinePencil, HiOutlineTrash, HiPlus, HiPlusCircle } from "react-icons/hi";
import { useTranslation } from "react-i18next";
import { ModalQuestion, useOpenModalQuestion } from "./modal-question";
import { useQuery } from "react-query";
import { getAllQuestions } from "../api";
import { formatDistance, parseISO } from "date-fns";
import { useAppI18n } from "@/hooks";
import { ModalDeleteQuestion, useDeleteQuestion } from "./modal-delete-question";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui";
import { SurveyRo } from "./surveyRo";
import { SurveyRu } from "./surveyRu";
import { SurveyEn } from "./surveyEn";
import { IQuestions } from "../types";
interface Message {
  id: number;
  doctor_id: number;
  question: string;
  language: "ro" | "ru" | "en";
  active: number;
  created_at: string;
  updated_at: string;
}
export const View: React.FC = () => {
  const { t } = useTranslation();
  const [questionId, setQuestionId] = React.useState<number>(0);
  const [isEditable, setIsEditable] = React.useState<boolean>(false);
  const [questionContent, setQuestionContent] = React.useState<string>("");
  const [languageQuestion, setLanguageQuestion] = React.useState<"ro" | "ru" | "en">("ro");
  const setOpenModalQuestion = useOpenModalQuestion((store) => store.setOpen);
  const setDeleteQuestion = useDeleteQuestion((store) => store.setOpen);

  const TAB_ITEMS = [
    {
      value: "surveyRo",
      children: t("survey:survey_ro"),
    },
    {
      value: "surveyRu",
      children: t("survey:survey_ru"),
    },
    {
      value: "surveyEn",
      children: t("survey:survey_en"),
    },
  ];
  const [groupedMessages, setGroupedMessages] = React.useState<Record<string, Message[]>>({
    ro: [],
    ru: [],
    en: [],
  });

  const { data: questions } = useQuery({
    queryKey: ["questions"],
    queryFn: async () => {
      return getAllQuestions();
    },
  });

  useEffect(() => {
    if (questions) {
      // Gruparea mesajelor după limbă
      const grouped = groupByLanguage(questions);
      setGroupedMessages(grouped);
    }
  }, [questions]);

  const groupByLanguage = (messages: IQuestions[]) => {
    const groupedMessages: Record<string, IQuestions[]> = {
      ro: [],
      ru: [],
      en: [],
    };

    messages.forEach((message) => {
      const { language } = message;
      if (language === "ro" || language === "ru" || language === "en") {
        groupedMessages[language].push(message);
      }
    });

    return groupedMessages;
  };

  return (
    <div
      className={cn(
        "custom-scroll-bar h-full w-full p-10 md:rounded-lg md:border md:border-neutral-200"
      )}
    >
      <Tabs defaultValue="surveyRo">
        <TabsList className="flex" aria-label="Survey tabs">
          {TAB_ITEMS.map(({ value, children }) => (
            <TabItem value={value} key={value}>
              {children}
            </TabItem>
          ))}
        </TabsList>

        <TabsContent className="grow rounded-b-md bg-white outline-none" value="surveyRo">
          <SurveyRo
            questions={groupedMessages.ro}
            setLanguageQuestion={setLanguageQuestion}
            setQuestionId={setQuestionId}
            setIsEditable={setIsEditable}
            setQuestionContent={setQuestionContent}
            setOpenModalQuestion={setOpenModalQuestion}
            setDeleteQuestion={setDeleteQuestion}
          />
        </TabsContent>
        <TabsContent className="grow rounded-b-md bg-white outline-none" value="surveyRu">
          <SurveyRu
            questions={groupedMessages.ru}
            setLanguageQuestion={setLanguageQuestion}
            setQuestionId={setQuestionId}
            setIsEditable={setIsEditable}
            setQuestionContent={setQuestionContent}
            setOpenModalQuestion={setOpenModalQuestion}
            setDeleteQuestion={setDeleteQuestion}
          />
        </TabsContent>
        <TabsContent className="grow rounded-b-md bg-white outline-none" value="surveyEn">
          <SurveyEn
            questions={groupedMessages.en}
            setLanguageQuestion={setLanguageQuestion}
            setQuestionId={setQuestionId}
            setIsEditable={setIsEditable}
            setQuestionContent={setQuestionContent}
            setOpenModalQuestion={setOpenModalQuestion}
            setDeleteQuestion={setDeleteQuestion}
          />
        </TabsContent>
      </Tabs>
      <ModalQuestion
        editable={isEditable}
        questionId={questionId}
        questionContent={questionContent}
        languageQuestion={languageQuestion}
      />
      <ModalDeleteQuestion questionId={questionId} />
    </div>
  );
};

const TabItem = ({ children, value }: { children: React.ReactNode; value: string }) => {
  return (
    <TabsTrigger
      className="flex flex-1 cursor-pointer items-center justify-center bg-white px-5 py-3 text-sm text-primary hover:font-medium data-[state=active]:rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:font-bold data-[state=active]:text-primary"
      value={value}
    >
      {children}
    </TabsTrigger>
  );
};
