import { Button } from '@/components/ui';
import { useTranslation } from 'react-i18next';
import { ArchiveBoxXMarkIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { Appointment } from '../types';

type AppointmentItemProps = {
  isLoading: boolean;
  data: Appointment[];
  title: string;
  completed?: boolean;
};

const AppointmentItem = (props: AppointmentItemProps) => {

  const { isLoading, data, title, completed } = props;
  const { t } = useTranslation();

  return (
    <div className="py-3">
      <div className="mb-5">
        <h6 className="ps-2 mb-2 text-gray-700 font-semibold">{title}</h6>
        <div className="flex flex-col space-y-4">
          {isLoading && (
            <div
              className="flex items-center justify-center w-full h-32"
            >
              {t("common:loading")}
            </div>
          )}
          {!data?.length && (
            <div className="flex flex-col items-center justify-center mt-8">
              <ArchiveBoxXMarkIcon className="w-16 h-16 text-gray-400" />
              <h4 className="text-md font-medium text-gray-400 mb-2">
                {t("common:empty_list")}
              </h4>
            </div>
          )}
          {data?.map((appointment: Appointment) => (
            <div key={appointment.id} className="flex items-center justify-between space-x-4 border-1 shadow-[0_2px_10px] shadow-black/10 hover:bg-mauve3 focus:shadow-[0_0_0_2px] rounded-md px-2 py-1 relative">
              <div className="w-1 h-10 bg-green-400 rounded-full absolute left-[0px] right-1/2" />
              <div className="flex flex-col">
                <span>{t("video:consultation_date")}</span>
                <p>{appointment.start_time}</p>
              </div>
              <div>
                <Link
                  to={`/conversations?id=${appointment.chat_id}`}
                >
                  <Button
                    size="sm"
                    className='bg-primary hover:bg-primary-hover xs:hover:bg-primary-hover sm:hover:bg-primary-hover md:hover:bg-primary-hover px-3 py-2'
                  >
                    {completed ? t("common:access") : t("common:summary")}
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AppointmentItem;