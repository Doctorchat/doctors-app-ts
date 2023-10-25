import type { SessionUser } from "../types";

import React from "react";

import { useEffectOnce, useLocalStorage } from "usehooks-ts";

import { apiGetSessionUser } from "../api";

import { FIREBASE_PERMISSION, SESSION_TOKEN_KEY, SESSION_USER_KEY } from "@/config";
import { useAppI18n } from "@/hooks";
import { AppLocale } from "@/types";
import { fetchToken } from "../../notification-firebase";

import { getMessaging, onMessage } from "firebase/messaging";
import { firebaseApp } from "@/features/notification-firebase/api/config";
import { useLocation } from "react-router-dom";

export interface AuthContextValue {
  session: {
    token: string | null;
    user: SessionUser | null;
    valid: boolean;
    validating: boolean;
  };
  initializeSession: (token: string, user: SessionUser) => void;
  clearSession: () => void;
  revalidateSession: () => void;
}

export const AuthContext = React.createContext<AuthContextValue>({
  session: {
    token: null,
    user: null,
    valid: false,
    validating: false,
  },
  initializeSession: () => {},
  clearSession: () => {},
  revalidateSession: () => {},
});

export interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { setLanguage } = useAppI18n();
  const [token, setToken] = useLocalStorage<string | null>(SESSION_TOKEN_KEY, null);
  const [user, setUser] = useLocalStorage<SessionUser | null>(SESSION_USER_KEY, null);
  const [validating, setValidating] = React.useState(false);

  const initializeSession = (token: string, user: SessionUser) => {
    setToken(token);
    setUser(user);
    setLanguage(user.locale as AppLocale);
    fetchToken(user);
  };

  const clearSession = React.useCallback(() => {
    setToken(null);
    setUser(null);
    fetchToken(null);
    localStorage.removeItem(FIREBASE_PERMISSION);
  }, [setToken, setUser]);

  const revalidateSession = React.useCallback(async () => {
    if (token === null) return clearSession();
    setValidating(true);
    try {
      const response = await apiGetSessionUser();
      setUser(response);
    } catch {
      clearSession();
    } finally {
      setValidating(false);
      fetchToken(user);
    }
  }, [clearSession, setUser, token]);

  const valid = React.useMemo(() => token !== null && user !== null, [token, user]);
  const session = React.useMemo(
    () => ({ token, user, valid, validating }),
    [token, user, valid, validating]
  );

  useEffectOnce(() => {
    revalidateSession();
  });

  const location = useLocation();
  React.useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      const messaging = getMessaging(firebaseApp);
      const unsubscribe = onMessage(messaging, (payload: any) => {
        const { title, body } = payload.data;
        const bodyData = JSON.parse(body);
        const chatId = window.location.search
          ? new URLSearchParams(window.location.search).get(
              bodyData.isPatientDoctorChat ? "patientId" : "doctorId"
            )
          : false;
        console.log(!chatId || Number(chatId) !== Number(bodyData.chat_id));

        if (!chatId || Number(chatId) !== Number(bodyData.chat_id)) {
          const notification = new Notification(title, {
            body: bodyData.content,
            icon: "https://doctorchat.md/wp-content/themes/doctorchat/favicon/apple-touch-icon.png",
          });
          const chat_type = bodyData.isPatientDoctorChat ? "patientId=" : "doctorId=";
          const url =
            window.location.origin +
            "/conversations?" +
            chat_type +
            (bodyData.chat_id ?? chatId) +
            "&anonymous=false";
          notification.onclick = () => {
            window.open(url);
          };
        }
      });

      return () => {
        unsubscribe();
      };
    }
  }, [window.location.href, location.search, location]);

  return (
    <AuthContext.Provider
      value={{
        session,
        initializeSession,
        clearSession,
        revalidateSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => React.useContext(AuthContext);
