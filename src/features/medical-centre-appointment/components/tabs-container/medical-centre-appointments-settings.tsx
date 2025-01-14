import { useTranslation } from "react-i18next";
import { Avatar, Collapse } from "antd";

import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { cn } from "@/utils";
import { FormAppointmentsSettings } from "../form-appointments-settings";
import { useMemo } from "react";
import { useMedicalCentreList } from "@/features/medical-centre-appointment/hooks";

/*const fakeDoctorMedicalCentre = [
  {
    id: "1",
    medical_centre: {
      id: 1,
      name: "Centrul medical Medi Partner",
      city: "Chișinău",
      address: "sec. Râșcani, bd. Moscova, 15/7",
      phone: "string",
      email: "string",
      logo: {
        url: "https://medipartner.md/wp-content/uploads/2021/06/Logo-01.png",
      },
      created_at: "2019-08-24T14:15:22Z",
      updated_at: "2019-08-24T14:15:22Z",
    },
  },
  {
    id: "2",
    medical_centre: {
      id: 2,
      name: "American Medical Center ",
      city: "Chișinău",
      address: "str. Pușkin 47/1",
      phone: "string",
      email: "string",
      logo: {
        url: "https://amc.md/uploads/settings/thumbs/version_100/5b9bd35fec2f7.png",
      },
      created_at: "2019-08-24T14:15:22Z",
      updated_at: "2019-08-24T14:15:22Z",
    },
  },
];*/

const MedicalCentreAppointmentsSettings = () => {
  const { t } = useTranslation();
  const { medicalCentre } = useMedicalCentreList();

  const collapseItems = useMemo(
    () =>
      medicalCentre?.map((item) => {
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
    [medicalCentre]
  );

  return (
    <div className="py-3">
      <div className="mb-5">
        <h6 className="mb-2 ps-2 font-semibold text-gray-700">{t("common:settings")}</h6>

        <Collapse accordion expandIconPosition="end" items={collapseItems} />
      </div>
    </div>
  );
};

export default MedicalCentreAppointmentsSettings;
