import React from "react";
import { useQuery } from "react-query";
import { Button } from "@/components/ui";
import { getSlots, removeSlot } from "../../api";
import { useTranslation } from "react-i18next";
import { Appointment } from "../../types";
import { useAuth } from "@/features/auth";
import { ArchiveBoxXMarkIcon } from "@heroicons/react/24/outline";
import { calculateDateTimeInTimeZone } from "@/utils/time-zone";
import Notification from "@/components/ui/notification";

const DocAppointmentsSlots = () => {
  const { t } = useTranslation();
  const { session } = useAuth();

  const {
    data: slots,
    isLoading: areSlotsLoading,
    refetch,
  } = useQuery({
    queryKey: ["slots", session?.user?.id],
    queryFn: async () => {
      return getSlots(session?.user?.id as number);
    },
    refetchOnWindowFocus: false,
    enabled: !!session?.user?.id,
  });
  const [isSubmited, setIsSubmited] = React.useState<boolean>(false);
  const [openNotification, setOpenNotification] = React.useState<boolean>(false);

  const onRemoveSlot = (slotId: number): void => {
    removeSlot(slotId)
      .then(() => {
        setOpenNotification(true);
        setTimeout(() => {
          setOpenNotification(false);
        }, 3000);
      })
      .catch((error) => console.error(error))
      .finally(() => {
        setIsSubmited(false);
        refetch();
      });
  };

  if (areSlotsLoading) {
    return (
      <div className="flex h-32 w-full items-center justify-center">{t("common:loading")}</div>
    );
  }

  if (!slots?.length) {
    return (
      <div className="mt-8 flex flex-col items-center justify-center">
        <ArchiveBoxXMarkIcon className="h-16 w-16 text-gray-400" />
        <h4 className="text-md mb-2 font-medium text-gray-400">{t("common:empty_list")}</h4>
      </div>
    );
  }

  return (
    <div className="py-3">
      <div className="mb-5">
        <h6 className="mb-2 ps-2 font-semibold text-gray-700">{t("video:active_appointments")}</h6>
        <div className="flex flex-col space-y-4">
          {slots?.map((appointment: Appointment) => (
            <div
              key={appointment.id}
              className="border-1 hover:bg-mauve3 relative flex items-center justify-between space-x-4 rounded-md px-2 py-1 shadow-[0_2px_10px] shadow-black/10 focus:shadow-[0_0_0_2px]"
            >
              <div className="absolute left-[0px] right-1/2 h-10 w-1 rounded-full bg-orange-200" />
              <div className="flex flex-col">
                <span>{t("video:consultation_date")}</span>
                <p>{calculateDateTimeInTimeZone(appointment.start_time)}</p>
              </div>
              <div>
                <Button
                  variant="primary"
                  disabled={isSubmited}
                  size="sm"
                  onClick={() => {
                    setIsSubmited(true);
                    onRemoveSlot(appointment.id);
                  }}
                >
                  {t("survey:title_delete")}
                  {isSubmited && "..."}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Notification
        open={openNotification ? true : false}
        onOpenChange={setOpenNotification.bind(null, false)}
        type={"success"}
        description={t("common:on_succes_notification")}
      />
    </div>
  );
};

export default DocAppointmentsSlots;
