import type { SessionUser } from "../types";

import React from "react";

import { useEffectOnce, useLocalStorage } from "usehooks-ts";

import { apiGetSessionUser } from "../api";

import { SESSION_TOKEN_KEY, SESSION_USER_KEY } from "@/config";
import { useAppI18n } from "@/hooks";
import { AppLocale } from "@/types";

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
  };

  const clearSession = React.useCallback(() => {
    setToken(null);
    setUser(null);
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
    }
  }, [clearSession, setUser, token]);

  const valid = React.useMemo(() => token !== null && user !== null, [token, user]);
  const session = React.useMemo(
    () => ({ token, user, valid, validating }),
    [token, user, valid, validating],
  );

  useEffectOnce(() => {
    revalidateSession();
  });

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
