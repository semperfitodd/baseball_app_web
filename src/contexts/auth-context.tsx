import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

import {
  generateOAuthState,
  generateOidcNonce,
  generatePKCE,
  getLoginUrl,
  getLogoutUrl,
  getTokenExpiration,
  isTokenExpired,
  parseIdToken,
  refreshTokens,
  verifyIdToken,
} from "@/config/cognito";
import { SESSION_KEYS, TOKEN_KEYS } from "@/config/storage-keys";
import type { UserInfo } from "@/types";

interface AuthContextValue {
  user: UserInfo | null;
  loading: boolean;
  authenticated: boolean;
  login: () => Promise<void>;
  logout: () => void;
  handleTokens: (idToken: string, accessToken: string, refreshToken?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null as AuthContextValue | null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTokens = useCallback(() => {
    localStorage.removeItem(TOKEN_KEYS.ID);
    localStorage.removeItem(TOKEN_KEYS.ACCESS);
    localStorage.removeItem(TOKEN_KEYS.REFRESH);
    setUser(null);
  }, []);

  const scheduleRefresh = useCallback(
    (idToken: string) => {
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
      }

      const exp = getTokenExpiration(idToken);
      if (!exp) return;

      const refreshAt = exp * 1000 - Date.now() - 5 * 60 * 1000;
      if (refreshAt <= 0) return;

      refreshTimerRef.current = setTimeout(async () => {
        const storedRefresh = localStorage.getItem(TOKEN_KEYS.REFRESH);
        if (!storedRefresh) {
          clearTokens();
          return;
        }

        try {
          const tokens = await refreshTokens(storedRefresh);
          localStorage.setItem(TOKEN_KEYS.ID, tokens.id_token);
          localStorage.setItem(TOKEN_KEYS.ACCESS, tokens.access_token);

          const userInfo = parseIdToken(tokens.id_token);
          setUser(userInfo);
          scheduleRefresh(tokens.id_token);
        } catch {
          clearTokens();
        }
      }, refreshAt);
    },
    [clearTokens],
  );

  useEffect(() => {
    async function initialize() {
      const idToken = localStorage.getItem(TOKEN_KEYS.ID);
      const storedRefresh = localStorage.getItem(TOKEN_KEYS.REFRESH);

      if (!idToken) {
        setLoading(false);
        return;
      }

      if (!isTokenExpired(idToken)) {
        try {
          const userInfo = await verifyIdToken(idToken);
          setUser(userInfo);
          scheduleRefresh(idToken);
        } catch {
          clearTokens();
        }
        setLoading(false);
        return;
      }

      if (storedRefresh) {
        try {
          const tokens = await refreshTokens(storedRefresh);
          localStorage.setItem(TOKEN_KEYS.ID, tokens.id_token);
          localStorage.setItem(TOKEN_KEYS.ACCESS, tokens.access_token);

          const userInfo = await verifyIdToken(tokens.id_token);
          setUser(userInfo);
          scheduleRefresh(tokens.id_token);
        } catch {
          clearTokens();
        }
      } else {
        clearTokens();
      }

      setLoading(false);
    }

    initialize();

    return () => {
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
      }
    };
  }, [clearTokens, scheduleRefresh]);

  const login = useCallback(async () => {
    const { codeVerifier, codeChallenge } = await generatePKCE();
    const state = generateOAuthState();
    const nonce = generateOidcNonce();

    sessionStorage.setItem(SESSION_KEYS.CODE_VERIFIER, codeVerifier);
    sessionStorage.setItem(SESSION_KEYS.STATE, state);
    sessionStorage.setItem(SESSION_KEYS.NONCE, nonce);

    window.location.href = getLoginUrl(codeChallenge, state, nonce);
  }, []);

  const handleTokens = useCallback(async (idToken: string, accessToken: string, refreshToken?: string) => {
    localStorage.setItem(TOKEN_KEYS.ID, idToken);
    localStorage.setItem(TOKEN_KEYS.ACCESS, accessToken);
    if (refreshToken) {
      localStorage.setItem(TOKEN_KEYS.REFRESH, refreshToken);
    }

    const userInfo = parseIdToken(idToken);
    setUser(userInfo);
    scheduleRefresh(idToken);
  }, [scheduleRefresh]);

  const logout = useCallback(() => {
    clearTokens();
    window.location.href = getLogoutUrl();
  }, [clearTokens]);

  return (
    <AuthContext value={{
      user,
      loading,
      authenticated: !!user,
      login,
      logout,
      handleTokens,
    }}>
      {children}
    </AuthContext>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
