interface OptionButtonProps {
  label: string;
  selected: boolean;
  state: "default" | "selected" | "correct" | "incorrect";
  disabled: boolean;
  onClick: () => void;
}

const stateClasses = {
  default: "border-gray-200 bg-white hover:border-navy-300 hover:bg-navy-50",
  selected: "border-navy-500 bg-navy-50 ring-2 ring-navy-200",
  correct: "border-green-500 bg-green-50",
  incorrect: "border-red-500 bg-red-50",
} as const;

export function OptionButton({ label, state, disabled, onClick }: OptionButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full min-h-[44px] rounded-lg border-2 px-4 py-3 text-left text-sm font-medium transition-all
        ${stateClasses[state]}
        ${disabled ? "cursor-not-allowed opacity-75" : "cursor-pointer"}
      `}
    >
      <span className={state === "correct" ? "text-green-700" : state === "incorrect" ? "text-red-700" : "text-gray-700"}>
        {label}
      </span>
      {state === "correct" && <span className="ml-2">✓</span>}
      {state === "incorrect" && <span className="ml-2">✗</span>}
    </button>
  );
}
