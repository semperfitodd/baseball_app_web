import { describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
  },
  ApiError: class ApiError extends Error {
    status: number;
    constructor(status: number, message: string) {
      super(message);
      this.status = status;
    }
  },
}));

describe("use-stats hooks", () => {
  it("exports useStats and useLeaderboard", async () => {
    const mod = await import("@/hooks/use-stats");
    expect(mod.useStats).toBeDefined();
    expect(mod.useLeaderboard).toBeDefined();
  });
});
