interface FieldPositionMarkerProps {
  x: number;
  y: number;
  label: string;
  highlighted: boolean;
  type: "fielder" | "runner" | "batter";
}

const TYPE_CONFIG = {
  fielder: { fill: "#1e3a5f", stroke: "#ffffff", r: 10 },
  runner:  { fill: "#d4382c", stroke: "#ffffff", r: 9 },
  batter:  { fill: "#1e3a5f", stroke: "#e8c72e", r: 10 },
} as const;

export function FieldPositionMarker({ x, y, label, highlighted, type }: FieldPositionMarkerProps) {
  const config = TYPE_CONFIG[type];

  return (
    <g>
      {highlighted && (
        <circle
          cx={x}
          cy={y}
          r={config.r + 8}
          fill="#e8c72e"
          opacity="0.45"
          filter="url(#highlightGlow)"
        />
      )}
      <circle
        cx={x}
        cy={y}
        r={config.r}
        fill={config.fill}
        stroke={highlighted ? "#e8c72e" : config.stroke}
        strokeWidth={highlighted ? 3 : 2}
      />
      {label && (
        <text
          x={x}
          y={y + 1}
          textAnchor="middle"
          dominantBaseline="central"
          fill="#ffffff"
          fontSize="8"
          fontFamily="sans-serif"
          fontWeight="bold"
        >
          {label}
        </text>
      )}
    </g>
  );
}
