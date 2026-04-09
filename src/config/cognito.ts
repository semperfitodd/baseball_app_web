import { createRemoteJWKSet, jwtVerify } from "jose";

import { getPortalConfig } from "@/config/env";
import type { UserInfo } from "@/types";

function base64urlEncode(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64urlDecode(str: string): string {
  const padded = str.replace(/-/g, "+").replace(/_/g, "/");
  return atob(padded);
}

export async function generatePKCE(): Promise<{
  codeVerifier: string;
  codeChallenge: string;
}> {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  const codeVerifier = base64urlEncode(array.buffer);

  const encoder = new TextEncoder();
  const digest = await crypto.subtle.digest("SHA-256", encoder.encode(codeVerifier));
  const codeChallenge = base64urlEncode(digest);

  return { codeVerifier, codeChallenge };
}

export function generateOAuthState(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return base64urlEncode(array.buffer);
}

export function generateOidcNonce(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return base64urlEncode(array.buffer);
}

export function getLoginUrl(
  codeChallenge: string,
  state: string,
  nonce: string,
): string {
  const config = getPortalConfig();
  const params = new URLSearchParams({
    response_type: "code",
    client_id: config.COGNITO_CLIENT_ID,
    redirect_uri: config.COGNITO_REDIRECT_URI,
    scope: "openid email profile",
    state,
    nonce,
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
  });
  return `${config.COGNITO_DOMAIN}/oauth2/authorize?${params}`;
}

export async function exchangeCodeForTokens(
  code: string,
  codeVerifier: string,
): Promise<{ id_token: string; access_token: string; refresh_token: string }> {
  const config = getPortalConfig();
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: config.COGNITO_CLIENT_ID,
    redirect_uri: config.COGNITO_REDIRECT_URI,
    code,
    code_verifier: codeVerifier,
  });

  const response = await fetch(`${config.COGNITO_DOMAIN}/oauth2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Token exchange failed: ${error}`);
  }

  return response.json();
}

export async function refreshTokens(
  refreshToken: string,
): Promise<{ id_token: string; access_token: string }> {
  const config = getPortalConfig();
  const body = new URLSearchParams({
    grant_type: "refresh_token",
    client_id: config.COGNITO_CLIENT_ID,
    refresh_token: refreshToken,
  });

  const response = await fetch(`${config.COGNITO_DOMAIN}/oauth2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Token refresh failed: ${error}`);
  }

  return response.json();
}

export function getLogoutUrl(): string {
  const config = getPortalConfig();
  const params = new URLSearchParams({
    client_id: config.COGNITO_CLIENT_ID,
    logout_uri: config.COGNITO_LOGOUT_URI,
  });
  return `${config.COGNITO_DOMAIN}/logout?${params}`;
}

let jwks: ReturnType<typeof createRemoteJWKSet> | null = null;

function getJWKS() {
  if (!jwks) {
    const config = getPortalConfig();
    const url = new URL(
      `https://cognito-idp.${config.AWS_REGION}.amazonaws.com/${config.COGNITO_USER_POOL_ID}/.well-known/jwks.json`,
    );
    jwks = createRemoteJWKSet(url);
  }
  return jwks;
}

export async function verifyIdToken(token: string, nonce?: string): Promise<UserInfo> {
  const config = getPortalConfig();
  const issuer = `https://cognito-idp.${config.AWS_REGION}.amazonaws.com/${config.COGNITO_USER_POOL_ID}`;

  const { payload } = await jwtVerify(token, getJWKS(), {
    issuer,
    audience: config.COGNITO_CLIENT_ID,
  });

  if (nonce && payload.nonce !== nonce) {
    throw new Error("Nonce mismatch");
  }

  return {
    sub: payload.sub ?? "",
    email: (payload.email as string) ?? "",
    name: (payload.name as string) ?? "",
    givenName: (payload.given_name as string) ?? "",
    picture: payload.picture as string | undefined,
  };
}

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  return JSON.parse(base64urlDecode(parts[1]));
}

export function parseIdToken(token: string): UserInfo {
  const payload = decodeJwtPayload(token);
  if (!payload) throw new Error("Invalid JWT format");

  return {
    sub: (payload.sub as string) ?? "",
    email: (payload.email as string) ?? "",
    name: (payload.name as string) ?? "",
    givenName: (payload.given_name as string) ?? "",
    picture: payload.picture as string | undefined,
  };
}

export function isTokenExpired(token: string): boolean {
  const payload = decodeJwtPayload(token);
  if (!payload?.exp) return true;

  const bufferSeconds = 5 * 60;
  return Date.now() / 1000 >= (payload.exp as number) - bufferSeconds;
}

export function getTokenExpiration(token: string): number | null {
  const payload = decodeJwtPayload(token);
  return (payload?.exp as number) ?? null;
}
