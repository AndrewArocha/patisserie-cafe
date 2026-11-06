import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { api, ApiError, clearAccessToken, readAccessToken, saveAccessToken } from "../lib/api";
import type { PublicUser } from "../types";

interface CurrentUserContextValue {
  currentUser: PublicUser | null;
  isSessionLoading: boolean;
  sessionMessage: string;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  deleteAccount: () => Promise<void>;
}

const CurrentUserContext = createContext<CurrentUserContextValue | null>(null);

export function CurrentUserProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<PublicUser | null>(null);
  const [isSessionLoading, setIsSessionLoading] = useState(true);
  const [sessionMessage, setSessionMessage] = useState("");

  useEffect(() => {
    let isMounted = true;
    const recoverSession = async () => {
      if (!readAccessToken()) {
        if (isMounted) setIsSessionLoading(false);
        return;
      }
      try {
        const result = await api.currentUser();
        if (isMounted) setCurrentUser(result.user);
      } catch (error) {
        if (error instanceof ApiError && error.status === 404) clearAccessToken();
        if (isMounted && !(error instanceof ApiError && error.status === 404)) {
          setSessionMessage(error instanceof Error ? error.message : "We couldn’t restore your session.");
        }
      } finally {
        if (isMounted) setIsSessionLoading(false);
      }
    };
    void recoverSession();
    return () => {
      isMounted = false;
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const result = await api.signIn(email, password);
    saveAccessToken(result.token);
    setCurrentUser(result.user);
    setSessionMessage("");
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    await api.signUp(email, password);
    const result = await api.signIn(email, password);
    saveAccessToken(result.token);
    setCurrentUser(result.user);
    setSessionMessage("Your account is ready. You’re signed in.");
  }, []);

  const signOut = useCallback(() => {
    clearAccessToken();
    setCurrentUser(null);
    setSessionMessage("You’ve signed out.");
  }, []);

  const deleteAccount = useCallback(async () => {
    await api.deleteAccount();
    clearAccessToken();
    setCurrentUser(null);
    setSessionMessage("Your account and order history have been deleted.");
  }, []);

  const value = useMemo(
    () => ({ currentUser, isSessionLoading, sessionMessage, signIn, signUp, signOut, deleteAccount }),
    [currentUser, isSessionLoading, sessionMessage, signIn, signUp, signOut, deleteAccount],
  );
  return <CurrentUserContext.Provider value={value}>{children}</CurrentUserContext.Provider>;
}

export function useCurrentUser() {
  const context = useContext(CurrentUserContext);
  if (!context) throw new Error("useCurrentUser must be used inside CurrentUserProvider.");
  return context;
}
