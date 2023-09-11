import React, { useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/features/auth';
import { authGoogleVerify } from '../../api';


const Authorize: React.FC = () => {
  const { t } = useTranslation();
  const { session } = useAuth();

  const verify = useCallback(async () => {
    const params = new URLSearchParams(window.location.search);

    const code = params.get('code');
    const authuser = params.get('authuser');
    const scope = params.get('scope');
    const prompt = params.get('prompt');

    if ([code, authuser, scope, prompt].some((param) => param === null)) {
      window.location.href = "/home";
    }

    try {
      await authGoogleVerify({ user_id: session?.user?.id, code, authuser, scope, prompt });
    } catch (error: any) {
    } finally {
      window.location.href = "/home";
    }
  }, [session?.user?.id]);

  useEffect(() => {
    verify();
  }, [verify]);

  return (
    <div
      className="flex flex-col items-center justify-center w-full h-full"
    >
      <p className="mt-3">{t('google_calendar.authorization')}...</p>
    </div>
  );
};

export default Authorize;