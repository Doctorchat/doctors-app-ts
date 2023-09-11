import React from 'react';
import { useQuery } from 'react-query';
import { Button } from '@/components/ui';
import { getSlots, removeSlot } from '../../api';
import { useTranslation } from 'react-i18next';
import { Appointment } from '../../types';
import { useAuth } from '@/features/auth';
import { ArchiveBoxXMarkIcon } from '@heroicons/react/24/outline';

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

  const onRemoveSlot = (slotId: number): void => {
    removeSlot(slotId).then(() => refetch());
  };

  if (areSlotsLoading) {
    return (
      <div
        className="flex items-center justify-center w-full h-32"
      >
        {t("common:loading")}
      </div>
    );
  };

  if (!slots?.length) {
    return (
      <div className="flex flex-col items-center justify-center mt-8">
        <ArchiveBoxXMarkIcon className="w-16 h-16 text-gray-400" />
        <h4 className="text-md font-medium text-gray-400 mb-2">
          {t("common:empty_list")}
        </h4>
      </div>
    );
  };

  return (
    <div className="py-3">
      <div className="mb-5">
        <h6 className="ps-2 mb-2 text-gray-700 font-semibold">{t("video:active_appointments")}</h6>
        <div className="flex flex-col space-y-4">
          {slots?.map((appointment: Appointment) => (
            <div key={appointment.id} className="flex items-center justify-between space-x-4 border-1 shadow-[0_2px_10px] shadow-black/10 hover:bg-mauve3 focus:shadow-[0_0_0_2px] rounded-md px-2 py-1 relative">
              <div className="w-1 h-10 bg-orange-200 rounded-full absolute left-[0px] right-1/2" />
              <div className="flex flex-col">
                <span>{t("video:consultation_date")}</span>
                <p>{appointment.start_time}</p>
              </div>
              <div>
                <Button
                  size="sm"
                  onClick={() => onRemoveSlot(appointment.id)}
                >
                  Șterge
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DocAppointmentsSlots;