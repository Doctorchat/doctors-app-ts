import { useTranslation } from "react-i18next";
import { Steps } from "antd";
import { StepItem, StepsProps, VacationData } from "../types";
import { useEffect, useState } from "react";

const StepsVacation: React.FC<StepsProps> = ({ limit, data }) => {
  const { t } = useTranslation();
  const [descriptionFinished, setDescriptionFinished] = useState<string | null>(null);
  const [descriptionProgress, setDescriptionProgress] = useState<string | null>(null);
  const [descriptionWaiting, setDescriptionWaiting] = useState<string | null>(null);
  useEffect(() => {
    const today = new Date();
    if (data.currentVacation.startDate && data.currentVacation.endDate) {
      // Verificați dacă data curentă este în intervalul din currentVacation
      const startDate = new Date(data.currentVacation.startDate);
      const endDate = new Date(data.currentVacation.endDate);

      if (today >= startDate && today <= endDate) {
        setDescriptionProgress(
          t("vacation:vacation") + ` ${startDate.toISOString()} - ${endDate.toISOString()}`
        );
      } else {
        setDescriptionWaiting(
          t("vacation:vacation") + ` ${startDate.toISOString()} - ${endDate.toISOString()}`
        );
      }
    }

    if (limit === 1) {
      for (const vacation of data.vacationsList) {
        const vacationStartDate = new Date(vacation.startDate);
        const vacationEndDate = new Date(vacation.endDate);

        if (today >= vacationStartDate) {
          setDescriptionFinished(
            t("vacation:vacation") +
              ` ${vacationStartDate.toISOString()} - ${vacationEndDate.toISOString()}`
          );
          break;
        }
      }
    } else {
      //   Parcurgeți vacationsList și adăugați variabile în descriptionFinished
      for (const vacation of data.vacationsList) {
        const vacationStartDate = new Date(vacation.startDate);
        const vacationEndDate = new Date(vacation.endDate);
        setDescriptionFinished((prevDescriptionFinished) => {
          if (prevDescriptionFinished) {
            return (
              prevDescriptionFinished +
              `\n${t(
                "vacation:vacation"
              )} ${vacationStartDate.toISOString()} - ${vacationEndDate.toISOString()}`
            );
          } else {
            return (
              t("vacation:vacation") +
              ` ${vacationStartDate.toISOString()} - ${vacationEndDate.toISOString()}`
            );
          }
        });
      }
    }
  }, []);

  // Verificați dacă descriptionProgress este gol și excludeți elementul corespunzător din items
  const items: StepItem[] = [
    {
      title: "Finished",
      description: descriptionFinished,
    },
  ];
  console.log(descriptionProgress, descriptionWaiting);

  if (descriptionProgress) {
    items.splice(1, 0, { title: "In Progress", description: descriptionProgress });
  }
  if (descriptionWaiting) {
    items.splice(2, 0, { title: "Waiting", description: descriptionWaiting });
  }

  return (
    <div className="flex justify-center justify-self-end	 py-1">
      <Steps direction="vertical" current={1} items={items} />
    </div>
  );
};
export default StepsVacation;
