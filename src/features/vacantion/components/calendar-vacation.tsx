import { useState } from "react";
import RangeCalendar from "@/components/ui/range-calendar";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import { Steps } from "antd";
import { Button } from "@/components/ui";
import React from "react";
import { toast } from "@/hooks";
import { getApiErrorMessages } from "@/utils";
import { apiSendVacation } from "../api";
import Notification from "@/components/ui/notification";

const VacationCalendar = () => {
  const { t } = useTranslation();
  const initialState: [Date | null, Date | null] = [null, null];
  const [value, setValue] = useState(initialState);
  const descriptionFinished = t("vacation:vacation") + " 01.10.2023 - 10.10.2023";
  const descriptionProgress = t("vacation:vacation") + " 15.11.2023 - 31.11.2023";
  const descriptionWaiting = t("vacation:vacation") + " 25.12.2023 - 03.01.2024";
  const [isSending, setIsSending] = React.useState(false);
  const [openNotification, setOpenNotification] = React.useState(false);
  const parseDateValues = (dateValues: any) => {
    return dateValues.map((dateString: any) => dayjs(dateString).format("DD.MM.YYYY"));
  };
  const onSaveVacation = async () => {
    setIsSending(true);
    try {
      const parsedDatesFormat = parseDateValues(value);
      await apiSendVacation({ range: parsedDatesFormat });
      setValue([null, null]);
      setOpenNotification(true);
      setTimeout(() => {
        setOpenNotification(false);
      }, 3000);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "common:something_went_wrong",
        description: getApiErrorMessages(error),
      });
    } finally {
      setIsSending(false);
    }
  };
  const setOnOpenChange = (val: { type: "error" | "success"; message: string } | null) => () =>
    setOpenNotification(!!val);
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
        <div className="pt-5">
          <Button
            type="submit"
            disabled={isSending}
            className="xs:hover:bg-primary-hover my-2 w-full bg-primary px-2 py-1 text-sm hover:bg-primary-hover sm:hover:bg-primary-hover md:hover:bg-primary-hover"
            onClick={onSaveVacation}
          >
            {t("common:save")}
          </Button>
        </div>
      </div>
      <div className="grid ">
        <div className="flex justify-self-center">
          <Steps
            direction="vertical"
            current={1}
            items={[
              {
                title: "Finished",
                description: descriptionFinished,
              },
              {
                title: "In Progress",
                description: descriptionProgress,
              },
              {
                title: "Waiting",
                description: descriptionWaiting,
              },
            ]}
          />
        </div>
      </div>
      <Notification
        onOpenChange={setOnOpenChange(null)}
        open={openNotification ? true : false}
        type={"success"}
        description={t("common:on_succes_notification")}
      />
    </div>
  );
};

export default VacationCalendar;
