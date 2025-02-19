import { Avatar, Empty, Badge, Skeleton } from "antd";
import { useTranslation } from "react-i18next";
import { LiteralUnion } from "antd/es/_util/type";
import { PresetColorKey } from "antd/es/theme/interface";
import { formatDateWithYearOption } from "@/utils/formatDate.ts";
import { getMyPhysicalConsultations } from "@/features/medical-centre-appointment/api";
import { useQuery } from "react-query";
import React, { useMemo } from "react";
import { DateTime } from "luxon";

interface ConsultationStatus {
  label: string;
  badgeColor: LiteralUnion<PresetColorKey>;
}

const MedicalCentreAppointmentsList = () => {
  const { t } = useTranslation();

  const { data: consultations, isLoading } = useQuery({
    queryKey: ["consultations-list"],
    queryFn: async () => {
      return await getMyPhysicalConsultations();
    },
  });

  const CONSULTATION_STATUS: Record<number, ConsultationStatus> = useMemo(
    () => ({
      0: {
        label: t("common:status_booked"),
        badgeColor: "gold",
      },
      1: {
        label: t("common:status_confirmed"),
        badgeColor: "green",
      },
      2: {
        label: t("common:status_canceled"),
        badgeColor: "red",
      },
      3: {
        label: t("common:status_completed"),
        badgeColor: "blue",
      },
    }),
    [t]
  );

  return (
    <>
      <div className="space-y-5 py-10">
        {isLoading ? (
          <Skeleton active round paragraph={{ rows: 5 }} title={false} />
        ) : (
          <>
            {!consultations?.data?.data?.length ? (
              <Empty description={t("common:empty_list")} />
            ) : (
              consultations?.data?.data?.map((consultation: any) => (
                <Badge.Ribbon
                  text={CONSULTATION_STATUS[consultation?.status]?.label}
                  color={CONSULTATION_STATUS[consultation?.status]?.badgeColor}
                  key={consultation?.id}
                >
                  <div className="rounded-xl border p-3">
                    <div className="flex gap-2">
                      <Avatar
                        size={72}
                        shape="square"
                        className="flex-none rounded-lg"
                        src={
                          consultation?.medical_centre?.logo?.url ||
                          "/img/default-logo-medical-centre.jpg"
                        }
                      />
                      <div>
                        <div className="mr-14 font-medium">
                          {consultation?.medical_centre?.name}
                        </div>
                        <div className="text-sm opacity-80">
                          {consultation?.medical_centre?.address},{" "}
                          {consultation?.medical_centre?.city}
                        </div>
                        <a
                          href={`tel:${consultation?.medical_centre?.phone}`}
                          className="text-sm font-medium text-primary"
                        >
                          {consultation?.medical_centre?.phone}
                        </a>
                      </div>
                    </div>

                    <div className="mt-3 border-t pt-3">
                      <div className="grid w-full gap-2 sm:grid-cols-2">
                        <div className="text-gray-500">
                          {t("common:date")}:{" "}
                          <span className="font-medium text-gray-700">
                            <p>
                              {DateTime.fromFormat(consultation.start_time, "yyyy-MM-dd HH:mm:ss", {
                                zone: "utc",
                              }).toFormat("d MMMM, HH:mm")}
                            </p>
                          </span>
                        </div>

                        <div className="text-gray-500">
                          {t("common:phone_number")}:{" "}
                          <span className="font-medium text-gray-700">
                            {consultation?.user?.phone}
                          </span>
                        </div>

                        <div className="text-gray-500">
                          {t("common:name")}:{" "}
                          <span className="font-medium text-gray-700">
                            {consultation?.user?.name}
                          </span>
                        </div>

                        <div className="text-gray-500">
                          {t("common:email_address")}:{" "}
                          <span className="font-medium text-gray-700">
                            {consultation?.user?.email}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Badge.Ribbon>
              ))
            )}
          </>
        )}
      </div>
    </>
  );
};

export default MedicalCentreAppointmentsList;
