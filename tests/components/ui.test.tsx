import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

describe("UI Components", () => {
  describe("Button", () => {
    it("renders with primary variant by default", () => {
      render(<Button>Click me</Button>);
      expect(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument();
    });

    it("renders with different variants", () => {
      const { rerender } = render(<Button variant="secondary">Secondary</Button>);
      expect(screen.getByRole("button")).toBeInTheDocument();

      rerender(<Button variant="danger">Danger</Button>);
      expect(screen.getByRole("button", { name: "Danger" })).toBeInTheDocument();
    });

    it("passes disabled prop", () => {
      render(<Button disabled>Disabled</Button>);
      expect(screen.getByRole("button")).toBeDisabled();
    });
  });

  describe("Card", () => {
    it("renders children", () => {
      render(<Card>Card content</Card>);
      expect(screen.getByText("Card content")).toBeInTheDocument();
    });
  });

  describe("Badge", () => {
    it("renders with text", () => {
      render(<Badge color="green">Rookie</Badge>);
      expect(screen.getByText("Rookie")).toBeInTheDocument();
    });
  });

  describe("LoadingSpinner", () => {
    it("renders with message", () => {
      render(<LoadingSpinner message="Loading..." />);
      expect(screen.getByText("Loading...")).toBeInTheDocument();
    });

    it("renders without message", () => {
      const { container } = render(<LoadingSpinner />);
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe("ErrorMessage", () => {
    it("renders error text", () => {
      render(<ErrorMessage message="Something went wrong" />);
      expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    });
  });
});
