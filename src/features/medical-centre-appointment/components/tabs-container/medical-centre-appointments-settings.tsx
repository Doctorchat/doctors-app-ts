import { useTranslation } from "react-i18next";
import { Avatar, Collapse, Empty, Skeleton } from "antd";
import { useMemo } from "react";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";

import { cn } from "@/utils";
import { useMedicalCentreList } from "@/features/medical-centre-appointment/hooks";
import { FormAppointmentsSettings } from "../form-appointments-settings";

const MedicalCentreAppointmentsSettings = () => {
  const { t } = useTranslation();
  const { medicalCentreList, isLoadingMedicalCentre } = useMedicalCentreList();

  const collapseItems = useMemo(
    () =>
      medicalCentreList?.map((item) => {
        return {
          key: item?.medical_centre?.id,
          label: (
            <div className="flex items-center gap-3">
              <Avatar
                shape="square"
                size="large"
                src={<img src={item?.medical_centre?.logo?.url} alt="avatar" />}
                className="ring-1 ring-gray-200"
              />
              <div className="">
                <div>{item?.medical_centre?.name}</div>
                <div className="text-xs opacity-60">
                  {item?.medical_centre?.address}, {item?.medical_centre?.city}
                </div>
              </div>
            </div>
          ),
          children: (
            <>
              <div
                className={cn(
                  "item-center mb-4 flex justify-center rounded-xl border border-primary bg-primary bg-opacity-10 px-3 py-2 font-medium"
                )}
              >
                <ExclamationCircleIcon className="mr-2 h-5 w-5 text-primary" />
                <p className="text-center text-sm text-primary">
                  {t("video:appointments_warning")}
                </p>
              </div>

              <FormAppointmentsSettings data={item} />
            </>
          ),
        };
      }),
    [medicalCentreList]
  );

  return (
    <div className="py-3">
      <div className="mb-5">
        <h6 className="mb-2 ps-2 font-semibold text-gray-700">{t("common:settings")}</h6>

        {isLoadingMedicalCentre ? (
          <Skeleton active round paragraph={{ rows: 5 }} title={false} />
        ) : (
          <>
            {!collapseItems?.length ? (
              <Empty description={t("common:empty_list")} />
            ) : (
              <Collapse accordion expandIconPosition="end" items={collapseItems} />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MedicalCentreAppointmentsSettings;
