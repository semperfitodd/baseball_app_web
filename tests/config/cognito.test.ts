import { describe, expect, it } from "vitest";

import { isTokenExpired, getTokenExpiration, parseIdToken } from "@/config/cognito";

function makeJwt(payload: Record<string, unknown>): string {
  const header = btoa(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const body = btoa(JSON.stringify(payload));
  return `${header}.${body}.fakesig`;
}

describe("cognito JWT utilities", () => {
  describe("parseIdToken", () => {
    it("parses a valid JWT payload", () => {
      const token = makeJwt({
        sub: "user-123",
        email: "test@example.com",
        name: "Test User",
        given_name: "Test",
        picture: "https://example.com/pic.jpg",
      });

      const user = parseIdToken(token);
      expect(user.sub).toBe("user-123");
      expect(user.email).toBe("test@example.com");
      expect(user.name).toBe("Test User");
      expect(user.givenName).toBe("Test");
      expect(user.picture).toBe("https://example.com/pic.jpg");
    });

    it("throws on invalid JWT format", () => {
      expect(() => parseIdToken("not.a.valid")).toThrow();
      expect(() => parseIdToken("only-one-part")).toThrow();
    });

    it("handles missing optional fields", () => {
      const token = makeJwt({ sub: "user-123" });
      const user = parseIdToken(token);
      expect(user.sub).toBe("user-123");
      expect(user.email).toBe("");
      expect(user.picture).toBeUndefined();
    });
  });

  describe("isTokenExpired", () => {
    it("returns true for expired tokens", () => {
      const token = makeJwt({ exp: Math.floor(Date.now() / 1000) - 600 });
      expect(isTokenExpired(token)).toBe(true);
    });

    it("returns false for valid tokens", () => {
      const token = makeJwt({ exp: Math.floor(Date.now() / 1000) + 3600 });
      expect(isTokenExpired(token)).toBe(false);
    });

    it("returns true for tokens without exp", () => {
      const token = makeJwt({});
      expect(isTokenExpired(token)).toBe(true);
    });

    it("returns true for malformed tokens", () => {
      expect(isTokenExpired("bad")).toBe(true);
    });
  });

  describe("getTokenExpiration", () => {
    it("returns exp from a valid token", () => {
      const exp = Math.floor(Date.now() / 1000) + 3600;
      const token = makeJwt({ exp });
      expect(getTokenExpiration(token)).toBe(exp);
    });

    it("returns null for tokens without exp", () => {
      const token = makeJwt({});
      expect(getTokenExpiration(token)).toBeNull();
    });

    it("returns null for malformed tokens", () => {
      expect(getTokenExpiration("bad")).toBeNull();
    });
  });
});
