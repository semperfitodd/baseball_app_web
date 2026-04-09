import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { exchangeCodeForTokens, verifyIdToken } from "@/config/cognito";
import { SESSION_KEYS } from "@/config/storage-keys";
import { useAuth } from "@/contexts/auth-context";

export function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { handleTokens } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const processed = useRef(false);

  useEffect(() => {
    if (processed.current) return;
    processed.current = true;

    async function handleCallback() {
      const code = searchParams.get("code");
      const state = searchParams.get("state");
      const errorParam = searchParams.get("error");

      if (errorParam) {
        setError(`Authentication failed: ${errorParam}`);
        return;
      }

      if (!code || !state) {
        setError("Missing authorization code or state");
        return;
      }

      const savedState = sessionStorage.getItem(SESSION_KEYS.STATE);
      const codeVerifier = sessionStorage.getItem(SESSION_KEYS.CODE_VERIFIER);
      const nonce = sessionStorage.getItem(SESSION_KEYS.NONCE);

      if (state !== savedState) {
        setError("State mismatch — possible CSRF attack");
        return;
      }

      if (!codeVerifier) {
        setError("Missing PKCE code verifier");
        return;
      }

      try {
        const tokens = await exchangeCodeForTokens(code, codeVerifier);

        await verifyIdToken(tokens.id_token, nonce ?? undefined);

        await handleTokens(tokens.id_token, tokens.access_token, tokens.refresh_token);

        sessionStorage.removeItem(SESSION_KEYS.CODE_VERIFIER);
        sessionStorage.removeItem(SESSION_KEYS.STATE);
        sessionStorage.removeItem(SESSION_KEYS.NONCE);

        navigate("/", { replace: true });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Token exchange failed");
      }
    }

    handleCallback();
  }, [searchParams, navigate, handleTokens]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-sm rounded-xl bg-white p-6 text-center shadow-sm">
          <p className="mb-4 text-sm text-red-600">{error}</p>
          <a
            href="/login"
            className="inline-flex min-h-[44px] items-center rounded-lg bg-navy-700 px-4 py-2 text-sm font-medium text-white hover:bg-navy-800"
          >
            Back to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <LoadingSpinner message="Completing sign in..." />
    </div>
  );
}
