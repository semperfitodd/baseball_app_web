import { Badge } from "@/components/ui/Badge";

const difficultyConfig = {
  rookie: { color: "green", label: "Rookie" },
  veteran: { color: "yellow", label: "Veteran" },
  allstar: { color: "red", label: "All-Star" },
} as const;

interface DifficultyBadgeProps {
  difficulty: keyof typeof difficultyConfig;
}

export function DifficultyBadge({ difficulty }: DifficultyBadgeProps) {
  const config = difficultyConfig[difficulty];
  return <Badge color={config.color}>{config.label}</Badge>;
}
