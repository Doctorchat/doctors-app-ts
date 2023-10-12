import { useState } from "react";
import RangeCalendar from "@/components/ui/range-calendar";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import { Steps } from "antd";

const VacationCalendar = () => {
  const initialState: [Date | null, Date | null] = [
    new Date(),
    dayjs(new Date()).add(5, "days").toDate(),
  ];
  const { t } = useTranslation();

  const [value, setValue] = useState(initialState);
  const description = "Vacation 01.06.2023 - 10.06.2023.";
  return (
    <div className="grid justify-center sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2  ">
      <div className=" p-5">
        <div className="py-4">
          <div className="inline-flex">
            <div className="text-red-600">*</div>
            <p> {t("vacation:description")}</p>
          </div>
        </div>
        <RangeCalendar value={value} onChange={setValue} />
      </div>
      <div className="grid ">
        <div className="flex justify-self-center">
          <Steps
            direction="vertical"
            current={1}
            items={[
              {
                title: "Finished",
                description,
              },
              {
                title: "In Progress",
                description,
              },
              {
                title: "Waiting",
                description,
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default VacationCalendar;
