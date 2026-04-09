import { describe, expect, it } from "vitest";

import { SESSION_KEYS, TOKEN_KEYS } from "@/config/storage-keys";

describe("storage-keys", () => {
  it("defines all token keys", () => {
    expect(TOKEN_KEYS.ID).toBe("cognito_id_token");
    expect(TOKEN_KEYS.ACCESS).toBe("cognito_access_token");
    expect(TOKEN_KEYS.REFRESH).toBe("cognito_refresh_token");
  });

  it("defines all session keys", () => {
    expect(SESSION_KEYS.CODE_VERIFIER).toBe("pkce_code_verifier");
    expect(SESSION_KEYS.STATE).toBe("oauth_state");
    expect(SESSION_KEYS.NONCE).toBe("oidc_nonce");
  });

  it("keys are readonly", () => {
    expect(Object.isFrozen(TOKEN_KEYS)).toBe(false);
    expect(typeof TOKEN_KEYS.ID).toBe("string");
  });
});
