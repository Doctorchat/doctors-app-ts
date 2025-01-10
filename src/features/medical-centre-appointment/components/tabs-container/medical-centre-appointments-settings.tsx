import { useAuth } from "@/features/auth";
import { useTranslation } from "react-i18next";
import { Avatar, Collapse } from "antd";

import { ExclamationCircleIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";
import { cn } from "@/utils";
import FormAppointmentsSettings from "../form-appointments-settings";
import { useMemo } from "react";

const fakeDoctorMedicalCentre = [
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
];

const MedicalCentreAppointmentsSettings = () => {
  const { t } = useTranslation();
  const { session } = useAuth();

  const collapseItems = useMemo(() => {
    return fakeDoctorMedicalCentre?.map(({ medical_centre: { id, city, address, name, logo } }) => {
      return {
        key: id,
        label: (
          <div className="">
            <Avatar shape="square" src={<img src={logo?.url} alt="avatar" />} />
            {name}
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
              <p className="text-center text-sm text-primary">{t("video:appointments_warning")}</p>
            </div>

            <FormAppointmentsSettings />
          </>
        ),
        extra: <Cog6ToothIcon className="size-5" />,
      };
    });
  }, [fakeDoctorMedicalCentre]);

  return (
    <div className="py-3">
      <div className="mb-5">
        <h6 className="mb-2 ps-2 font-semibold text-gray-700">{t("common:settings")}</h6>

        <Collapse expandIconPosition="end" items={collapseItems} />
      </div>
    </div>
  );
};

export default MedicalCentreAppointmentsSettings;
