import React from "react";
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
export interface ViewProps {
  inContainer?: boolean;
}
export const View: React.FC<ViewProps> = ({ inContainer }) => {
  const { t } = useTranslation();
  const [questionId, setQuestionId] = React.useState<number>(0);
  const [isEditable, setIsEditable] = React.useState<boolean>(false);
  const [questionContent, setQuestionContent] = React.useState<string>("");

  const setOpenModalQuestion = useOpenModalQuestion((store) => store.setOpen);
  const setDeleteQuestion = useDeleteQuestion((store) => store.setOpen);
  const { data: questions, isLoading } = useQuery({
    queryKey: ["questions"],
    queryFn: async () => {
      return getAllQuestions();
    },
  });
  const { locale } = useAppI18n();

  return (
    <div
      className={cn(
        "custom-scroll-bar h-full w-full p-10 md:rounded-lg md:border md:border-neutral-200"
      )}
    >
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {questions?.length &&
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
        <Card
          hoverable
          bordered
          onClick={() => {
            setIsEditable(false), setQuestionContent(""), setOpenModalQuestion(true);
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
      </div>
      <ModalQuestion
        editable={isEditable}
        questionId={questionId}
        questionContent={questionContent}
      />
      <ModalDeleteQuestion questionId={questionId} />
    </div>
  );
};
