export const TOKEN_KEYS = {
  ID: "cognito_id_token",
  ACCESS: "cognito_access_token",
  REFRESH: "cognito_refresh_token",
} as const;

export const SESSION_KEYS = {
  CODE_VERIFIER: "pkce_code_verifier",
  STATE: "oauth_state",
  NONCE: "oidc_nonce",
} as const;
