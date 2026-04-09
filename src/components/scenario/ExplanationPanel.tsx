import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

interface ExplanationPanelProps {
  correct: boolean;
  explanation: string;
  streak: number;
  onNext: () => void;
}

export function ExplanationPanel({ correct, explanation, streak, onNext }: ExplanationPanelProps) {
  return (
    <Card className={correct ? "border-2 border-green-200" : "border-2 border-red-200"}>
      <div className="mb-3 flex items-center gap-2">
        <span className={`text-lg font-bold ${correct ? "text-green-600" : "text-red-600"}`}>
          {correct ? "✓ Correct!" : "✗ Incorrect"}
        </span>
        {streak > 1 && (
          <span className="text-sm font-medium text-orange-500">
            🔥 {streak} streak
          </span>
        )}
      </div>

      <p className="mb-4 text-sm text-gray-700">{explanation}</p>

      <Button onClick={onNext} className="w-full">
        Next Scenario
      </Button>
    </Card>
  );
}
