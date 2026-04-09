interface PortalConfig {
  COGNITO_DOMAIN: string;
  COGNITO_CLIENT_ID: string;
  COGNITO_USER_POOL_ID: string;
  COGNITO_REDIRECT_URI: string;
  COGNITO_LOGOUT_URI: string;
  AWS_REGION: string;
}

let cached: PortalConfig | null = null;

export function getPortalConfig(): PortalConfig {
  if (cached) return cached;

  const rawDomain: string = import.meta.env.VITE_COGNITO_DOMAIN ?? "";
  const config: PortalConfig = {
    COGNITO_DOMAIN: rawDomain.startsWith("https://") ? rawDomain : `https://${rawDomain}`,
    COGNITO_CLIENT_ID: import.meta.env.VITE_COGNITO_CLIENT_ID ?? "",
    COGNITO_USER_POOL_ID: import.meta.env.VITE_COGNITO_USER_POOL_ID ?? "",
    COGNITO_REDIRECT_URI: import.meta.env.VITE_COGNITO_REDIRECT_URI ?? `${window.location.origin}/auth/callback`,
    COGNITO_LOGOUT_URI: import.meta.env.VITE_COGNITO_LOGOUT_URI ?? window.location.origin,
    AWS_REGION: import.meta.env.VITE_AWS_REGION ?? "us-east-1",
  };

  for (const [key, value] of Object.entries(config)) {
    if (!value) throw new Error(`Missing required env var: VITE_${key}`);
  }

  cached = config;
  return config;
}
