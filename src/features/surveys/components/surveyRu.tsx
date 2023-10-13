import React from "react";
import { cn } from "@/utils";
import { Card, Tooltip } from "antd";
import TextEllipsis from "@/components/ui/textEllipsis";
import Button from "@/components/ui/buttonIcon";
import { HiOutlinePencil, HiOutlineTrash, HiPlus, HiPlusCircle } from "react-icons/hi";
import { useTranslation } from "react-i18next";
import { formatDistance, parseISO } from "date-fns";
import { useAppI18n } from "@/hooks";

export const SurveyRu: React.FC<any> = ({
  questions,
  setQuestionId,
  setIsEditable,
  setQuestionContent,
  setOpenModalQuestion,
  setDeleteQuestion,
  setLanguageQuestion,
}) => {
  const { t } = useTranslation();
  const { locale } = useAppI18n();

  return (
    <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <Card
        hoverable
        bordered
        onClick={() => {
          setLanguageQuestion("ru"),
            setIsEditable(false),
            setQuestionContent(""),
            setOpenModalQuestion(true);
        }}
      >
        {/* {article.title} */}
        <h6 className="mb-4 truncate text-lg text-primary">{t("survey:add_question")}</h6>
        <div className="min-h-[40px] text-primary">
          {/* article.content.replace(/<[^>]*>?/gm, "") */}
          <TextEllipsis text={t("survey:add_description")} maxTextCount={120} />
        </div>
        <Button
          shape="circle"
          variant="plain"
          size="lg"
          className="text-primary"
          icon={<HiPlus />}
        />
      </Card>
      {questions &&
        questions.length > 0 &&
        questions.map((question: any, index: any) => (
          <Card bordered hoverable>
            <h6 className="mb-4 truncate text-lg">{index + 1 + ". " + t("survey:question")}</h6>
            <div className="min-h-[40px] text-lg font-medium">
              <TextEllipsis text={question.question} maxTextCount={120} />
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="ml-2 whitespace-nowrap text-xs">
                <time dateTime={question.updated_at}>
                  {formatDistance(parseISO(question.updated_at), new Date(), {
                    addSuffix: true,
                    locale: locale(),
                  })}
                </time>
              </span>
              <div className="flex">
                <Button
                  shape="circle"
                  variant="twoTone"
                  size="sm"
                  icon={<HiOutlineTrash />}
                  onClick={() => {
                    setDeleteQuestion(true), setQuestionId(question.id);
                  }}
                />

                <Button
                  shape="circle"
                  variant="twoTone"
                  size="sm"
                  icon={<HiOutlinePencil />}
                  onClick={() => {
                    setLanguageQuestion(question.language),
                      setIsEditable(true),
                      setQuestionContent(question.question),
                      setQuestionId(question.id),
                      setOpenModalQuestion(true);
                  }}
                />
              </div>
            </div>
          </Card>
        ))}
    </div>
  );
};
