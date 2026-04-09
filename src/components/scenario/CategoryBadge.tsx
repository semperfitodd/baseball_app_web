import { Badge } from "@/components/ui/Badge";

const categoryConfig = {
  batting: { color: "blue", label: "Batting" },
  baserunning: { color: "purple", label: "Baserunning" },
  fielding: { color: "green", label: "Fielding" },
  pitching: { color: "red", label: "Pitching" },
  situational: { color: "yellow", label: "Situational" },
} as const;

interface CategoryBadgeProps {
  category: keyof typeof categoryConfig;
}

export function CategoryBadge({ category }: CategoryBadgeProps) {
  const config = categoryConfig[category];
  return <Badge color={config.color}>{config.label}</Badge>;
}
