import { useTranslation } from "react-i18next";
import { Steps } from "antd";
import { StepItem, StepsProps, VacationData } from "../types";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/ro";
import "dayjs/locale/en";
import "dayjs/locale/ru";
import { Card } from "@/components/ui";

const StepsVacation: React.FC<StepsProps> = ({ limit, data }) => {
  const { t } = useTranslation();
  const [descriptionFinished, setDescriptionFinished] = useState<string | null>(null);
  const [descriptionProgress, setDescriptionProgress] = useState<string | null>(null);
  const [descriptionWaiting, setDescriptionWaiting] = useState<string | null>(null);

  const { i18n } = useTranslation();
  const formatDate = (
    startDate: string | number | Date | dayjs.Dayjs | null | undefined,
    endDate: string | number | Date | dayjs.Dayjs | null | undefined
  ) => {
    return `${t("vacation:vacation")} ${dayjs(startDate).format("DD MMMM YYYY")} - ${dayjs(
      endDate
    ).format("DD MMMM YYYY")}`;
  };

  const [manyDatesFinished, setManyDatesFinished] = useState<StepItem[]>([]);
  useEffect(() => {
    dayjs.locale(i18n.language);
    const today = new Date();
    setManyDatesFinished([]);

    if (data.currentVacation.startDate && data.currentVacation.endDate) {
      // Verificați dacă data curentă este în intervalul din currentVacation
      const startDate = new Date(data.currentVacation.startDate);
      const endDate = new Date(data.currentVacation.endDate);

      if (today >= startDate && today <= endDate) {
        setDescriptionProgress(formatDate(startDate, endDate));
      } else {
        setDescriptionWaiting(formatDate(startDate, endDate));
      }
    }

    if (limit === 1) {
      for (const vacation of data.vacationsList) {
        const vacationStartDate = new Date(vacation.startDate);
        const vacationEndDate = new Date(vacation.endDate);

        if (today >= vacationStartDate) {
          setDescriptionFinished(formatDate(vacationStartDate, vacationEndDate));
          break;
        }
      }
    } else {
      for (const vacation of data.vacationsList) {
        const vacationStartDate = new Date(vacation.startDate);
        const vacationEndDate = new Date(vacation.endDate);

        const newEntry: StepItem = {
          title: t("vacation:time_finished"),
          description: (
            <Card className="mt-1 p-2 ">
              <p className="text-sky-500"> {formatDate(vacationStartDate, vacationEndDate)}</p>
              <p>
                Am nevoie de o pauză de la munca zilnică pentru a-mi reîncărca bateriile și a reduce
                stresul acumulat. Concediul îmi oferă oportunitatea de a petrece timp de calitate cu
                familia și de a explora locuri noi. Această pauză îmi va permite să revin la muncă
                cu energie proaspătă și cu o perspectivă mai clară.
              </p>
            </Card>
          ),
        };

        setManyDatesFinished((prevDates) => [...prevDates, newEntry]);
      }
    }
  }, [data.vacationsList, i18n]);

  const itemFinished = {
    title: t("vacation:time_finished"),
    description: descriptionFinished,
  };
  const items: StepItem[] = [];
  const defaultItems: StepItem[] = [
    {
      title: t("vacation:time_finished"),
      description: (
        <Card className="mt-1 p-2 ">
          <p className="text-sky-500">{t("vacation:default_finished")}</p>
          <p>
            Am nevoie de o pauză de la munca zilnică pentru a-mi reîncărca bateriile și a reduce
            stresul acumulat.
          </p>
        </Card>
      ),
    },
    {
      title: t("vacation:time_progress"),
      description: (
        <Card className="mt-1 p-2 ">
          <p className="text-sky-500"> {t("vacation:default_progress")}</p>
          <p>
            Concediul îmi oferă oportunitatea de a petrece timp de calitate cu familia și de a
            explora locuri noi.
          </p>
        </Card>
      ),
    },
    {
      title: t("vacation:time_waiting"),
      description: (
        <Card className="mt-1 p-2 ">
          <p className="text-sky-500">{t("vacation:default_waiting")}</p>
          <p>
            Această pauză îmi va permite să revin la muncă cu energie proaspătă și cu o perspectivă
            mai clară.
          </p>
        </Card>
      ),
    },
  ];

  if (descriptionProgress) {
    items.push({ title: t("vacation:time_progress"), description: descriptionProgress });
  }

  if (descriptionWaiting) {
    items.push({ title: t("vacation:time_waiting"), description: descriptionWaiting });
  }

  if (descriptionFinished) {
    items.push(itemFinished);
  }

  items.push(...manyDatesFinished);
  return (
    <>
      {items.length ? (
        <div className="flex justify-center justify-self-end py-1">
          <Steps direction="vertical" current={1} items={items} />
        </div>
      ) : (
        <div className="flex justify-center justify-self-end px-4 py-2">
          <Steps direction="vertical" current={0} items={defaultItems} />
        </div>
      )}
    </>
  );
};
export default StepsVacation;
