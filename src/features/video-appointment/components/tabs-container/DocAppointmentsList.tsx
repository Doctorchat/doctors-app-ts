import { useQuery } from 'react-query';
import { getFinishedMeetings, getMeetings, getSlots, removeSlot } from '../../api';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/features/auth';
import AppointmentItem from '../appointment-item';

const DocAppointmentsList = () => {
  const { t } = useTranslation();
  const { session } = useAuth();

  const {
    data: meetings,
    isLoading: isMeetingsLoading,
  } = useQuery({
    queryKey: ["active-appointments", session?.user?.id],
    queryFn: async () => {
      return getMeetings();
    },
    refetchOnWindowFocus: false,
  });

  const {
    data: finishedMeetings,
    isLoading: isFinishedMeetingsLoading,
  } = useQuery({
    queryKey: ["finished-appointments"],
    queryFn: async () => {
      return getFinishedMeetings();
    },
    refetchOnWindowFocus: false,
  });

  return (
    <>
      <AppointmentItem
        isLoading={isMeetingsLoading}
        data={meetings}
        title={t("video:active_appointments")}
      />

      <AppointmentItem
        isLoading={isFinishedMeetingsLoading}
        data={finishedMeetings}
        title={t("video:finished_appointments")}
        completed
      />
    </>
  );
};

export default DocAppointmentsList;