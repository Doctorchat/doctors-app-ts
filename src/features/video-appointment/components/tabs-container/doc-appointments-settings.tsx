import { useAuth } from '@/features/auth';
import { useTranslation } from 'react-i18next';
import {
  CalendarDaysIcon,
  ArrowTopRightOnSquareIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui';
import { cn } from '@/utils';
import FormAppointmentsSettings from '../form-appointments-settings';
import { useCallback, useState } from 'react';
import { authGoogleCancel } from '../../api';
import { Navigate } from 'react-router-dom';

const DocAppointmentsSettings = () => {

  const { t } = useTranslation();
  const { session } = useAuth();
  const [isGoogleCalendarAuthorizing, setIsGoogleCalendarAuthorizing] = useState(false);


  const unauthorizeGoogleCalendar = useCallback(() => {
    setIsGoogleCalendarAuthorizing(true);
    // await api.auth.google.cancel();
    authGoogleCancel()
      .then(() => {
        console.log("unauthorizeGoogleCalendar", "success");
      })
      .catch((error) => {
        console.log("unauthorizeGoogleCalendar", "error", error);
      })
      .finally(() => {
        setIsGoogleCalendarAuthorizing(false);
      });
  }, []);

  const authorizeGoogleCalendar = useCallback(() => {
    setIsGoogleCalendarAuthorizing(true);
    window.location.href = "https://api.doctorchat.md/authorize/start"; // TO DO REVIEW
    setIsGoogleCalendarAuthorizing(false);
  }, []);

  return (
    <div className="py-3">
      <div className="mb-5">
        <h6 className="ps-2 mb-2 text-gray-700 font-semibold">{t("common:settings")}</h6>
        {/* Google */}
        <Button
          className={
            cn("flex items-center justify-between w-full rounded-md px-5 py-5 text-sm font-medium text-gray-700 bg-white hover:bg-gray-200 xs:hover:bg-gray-200 sm:hover:bg-gray-200 md:hover:bg-gray-200 lg:hover:bg-gray-200 xl:hover:bg-gray-200 border border-solid border-gray-100")
          }
          onClick={session?.user?.["g-auth"] ? unauthorizeGoogleCalendar : authorizeGoogleCalendar}
        >
          <div className="flex items-center justify-between flex-grow-1 w-full">
            <CalendarDaysIcon className="w-6 h-6 text-gray-600" />
            {session?.user?.["g-auth"] ? t("common:google_calendar.unauthorize") : t("common:google_calendar.authorize")}
            <ArrowTopRightOnSquareIcon className="w-6 h-6 text-gray-600" />
          </div>
        </Button>
        <div className={cn("flex item-center justify-center mb-4 mt-3 border border-primary bg-primary bg-opacity-10 px-3 py-2 rounded-xl font-medium")}>
          <ExclamationCircleIcon
            className="text-primary w-5 h-5 mr-2"
          />
          <p className="text-sm text-primary text-center">{t("video:appointments_warning")}</p>
        </div>
        <FormAppointmentsSettings />
      </div>
    </div>
  );
};

export default DocAppointmentsSettings;