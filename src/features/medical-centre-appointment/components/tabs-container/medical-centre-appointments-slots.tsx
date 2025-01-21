import React, { useMemo } from "react";
import { Avatar, Collapse, Empty, Skeleton } from "antd";
import { useTranslation } from "react-i18next";

import Notification from "@/components/ui/notification";
import { useMedicalCentreList } from "@/features/medical-centre-appointment/hooks";
import { MedicalCentreSlotItem } from "@/features/medical-centre-appointment/components/tabs-container/medical-centre-slot-item";

const MedicalCentreAppointmentsSlots = () => {
  const { t } = useTranslation();

  const { medicalCentreList, isLoadingMedicalCentre } = useMedicalCentreList();

  const collapseItems = useMemo(
    () =>
      medicalCentreList?.map((item) => {
        const { id, city, address, name, logo } = item?.medical_centre;
        return {
          key: id,
          label: (
            <div className="flex items-center gap-3">
              <Avatar
                shape="square"
                size="large"
                src={<img src={logo?.url} alt="avatar" />}
                className="ring-1 ring-gray-200"
              />
              <div className="">
                <div>{name}</div>
                <div className="text-xs opacity-60">
                  {address}, {city}
                </div>
              </div>
            </div>
          ),
          children: <MedicalCentreSlotItem id={id} />,
        };
      }),
    [medicalCentreList]
  );

  const [openNotification, setOpenNotification] = React.useState<boolean>(false);

  return (
    <div className="py-3">
      <div className="mb-5">
        <h6 className="mb-2 ps-2 font-semibold text-gray-700">{t("video:active_appointments")}</h6>
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

      <Notification
        open={Boolean(openNotification)}
        onOpenChange={setOpenNotification.bind(null, false)}
        type={"success"}
        description={t("common:on_succes_notification")}
      />
    </div>
  );
};

export default MedicalCentreAppointmentsSlots;
