import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { FenwayField } from "@/components/field/FenwayField";
import type { FieldState } from "@/types";

describe("FenwayField", () => {
  it("renders without crashing when fieldState is undefined", () => {
    const { container } = render(<FenwayField />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("renders the field diagram with aria label", () => {
    render(<FenwayField fieldState={{ runners: [], outs: 0 }} />);
    expect(screen.getByRole("img", { name: /fenway park/i })).toBeInTheDocument();
  });

  it("renders outs indicator showing correct count", () => {
    const { container } = render(
      <FenwayField fieldState={{ runners: [], outs: 2 }} />,
    );
    const outCircles = container.querySelectorAll("circle[cy='14']");
    const filled = Array.from(outCircles).filter(
      (c) => c.getAttribute("fill") === "#e8c72e",
    );
    expect(filled).toHaveLength(2);
  });

  it("renders runner markers for occupied bases", () => {
    const state: FieldState = { runners: ["first", "third"], outs: 0 };
    const { container } = render(<FenwayField fieldState={state} />);
    const allCircles = container.querySelectorAll("circle");
    const runnerFills = Array.from(allCircles).filter(
      (c) => c.getAttribute("fill") === "#d4382c",
    );
    expect(runnerFills).toHaveLength(2);
  });

  it("renders batted ball when location is provided", () => {
    const state: FieldState = {
      runners: [],
      outs: 0,
      battedBallLocation: { x: 50, y: 25 },
    };
    const { container } = render(<FenwayField fieldState={state} />);
    const ballCircles = Array.from(container.querySelectorAll("circle")).filter(
      (c) => c.getAttribute("fill") === "url(#ballGradient)",
    );
    expect(ballCircles).toHaveLength(1);
  });

  it("does not render batted ball when location is absent", () => {
    const { container } = render(
      <FenwayField fieldState={{ runners: [], outs: 0 }} />,
    );
    const ballCircles = Array.from(container.querySelectorAll("circle")).filter(
      (c) => c.getAttribute("fill") === "url(#ballGradient)",
    );
    expect(ballCircles).toHaveLength(0);
  });

  it("highlights the specified player position", () => {
    const state: FieldState = { runners: [], outs: 0, highlightPlayer: "SS" };
    const { container } = render(<FenwayField fieldState={state} />);
    const glowCircles = Array.from(container.querySelectorAll("circle")).filter(
      (c) => c.getAttribute("filter") === "url(#highlightGlow)",
    );
    expect(glowCircles.length).toBeGreaterThanOrEqual(1);
  });

  it("applies custom className", () => {
    const { container } = render(<FenwayField className="w-full" />);
    expect(container.querySelector("svg")?.classList.contains("w-full")).toBe(true);
  });
});
