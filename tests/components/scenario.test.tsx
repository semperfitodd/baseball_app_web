import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ExplanationPanel } from "@/components/scenario/ExplanationPanel";
import { OptionButton } from "@/components/scenario/OptionButton";
import { ScenarioCard } from "@/components/scenario/ScenarioCard";
import type { Scenario } from "@/types";

const mockScenario: Scenario = {
  scenarioId: "01ABC",
  title: "Test Scenario",
  situation: "Runner on first, one out",
  playerName: "Mike Trout",
  playerPosition: "Center Fielder",
  options: [
    { id: "a", text: "Option A" },
    { id: "b", text: "Option B" },
    { id: "c", text: "Option C" },
    { id: "d", text: "Option D" },
  ],
  difficulty: "rookie",
  category: "batting",
};

describe("Scenario Components", () => {
  describe("ScenarioCard", () => {
    it("renders scenario details", () => {
      render(
        <ScenarioCard scenario={mockScenario}>
          <div>Options here</div>
        </ScenarioCard>,
      );

      expect(screen.getByText("Test Scenario")).toBeInTheDocument();
      expect(screen.getByText("Runner on first, one out")).toBeInTheDocument();
      expect(screen.getByText(/Mike Trout/)).toBeInTheDocument();
      expect(screen.getByText("Options here")).toBeInTheDocument();
    });
  });

  describe("OptionButton", () => {
    it("renders option text", () => {
      render(
        <OptionButton label="Swing away" selected={false} state="default" disabled={false} onClick={() => {}} />,
      );
      expect(screen.getByText("Swing away")).toBeInTheDocument();
    });

    it("calls onClick when clicked", async () => {
      const onClick = vi.fn();
      render(
        <OptionButton label="Swing away" selected={false} state="default" disabled={false} onClick={onClick} />,
      );
      await userEvent.click(screen.getByRole("button"));
      expect(onClick).toHaveBeenCalled();
    });

    it("is disabled when disabled prop is true", () => {
      render(
        <OptionButton label="Swing away" selected={false} state="correct" disabled={true} onClick={() => {}} />,
      );
      expect(screen.getByRole("button")).toBeDisabled();
    });
  });

  describe("ExplanationPanel", () => {
    it("renders correct result", () => {
      render(
        <ExplanationPanel
          correct={true}
          explanation="Good choice!"
          streak={3}
          onNext={() => {}}
        />,
      );
      expect(screen.getByText(/correct/i)).toBeInTheDocument();
      expect(screen.getByText("Good choice!")).toBeInTheDocument();
    });

    it("renders incorrect result", () => {
      render(
        <ExplanationPanel
          correct={false}
          explanation="Better luck next time"
          streak={0}
          onNext={() => {}}
        />,
      );
      expect(screen.getByText(/incorrect/i)).toBeInTheDocument();
    });

    it("calls onNext when button clicked", async () => {
      const onNext = vi.fn();
      render(
        <ExplanationPanel
          correct={true}
          explanation="Nice!"
          streak={1}
          onNext={onNext}
        />,
      );
      await userEvent.click(screen.getByRole("button", { name: /next/i }));
      expect(onNext).toHaveBeenCalled();
    });
  });
});
