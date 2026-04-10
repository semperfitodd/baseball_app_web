import type { FieldState } from "@/types";

import { FieldPositionMarker } from "./FieldPositionMarker";

const DEFAULT_FIELD_STATE: FieldState = { runners: [], outs: 0 };

interface FenwayFieldProps {
  fieldState?: FieldState;
  className?: string;
}

const FIELDER_POSITIONS: Record<string, { x: number; y: number; label: string }> = {
  P:  { x: 500, y: 490, label: "P" },
  C:  { x: 500, y: 700, label: "C" },
  "1B": { x: 630, y: 470, label: "1B" },
  "2B": { x: 570, y: 380, label: "2B" },
  SS: { x: 420, y: 390, label: "SS" },
  "3B": { x: 360, y: 470, label: "3B" },
  LF: { x: 250, y: 220, label: "LF" },
  CF: { x: 500, y: 160, label: "CF" },
  RF: { x: 740, y: 230, label: "RF" },
};

const RUNNER_POSITIONS: Record<string, { x: number; y: number }> = {
  first:  { x: 610, y: 520 },
  second: { x: 500, y: 430 },
  third:  { x: 390, y: 520 },
};

export function FenwayField({ fieldState: rawFieldState, className }: FenwayFieldProps) {
  const fieldState = rawFieldState ?? DEFAULT_FIELD_STATE;
  const ballPos = fieldState.battedBallLocation
    ? {
        x: 100 + (fieldState.battedBallLocation.x / 100) * 800,
        y: 50 + ((100 - fieldState.battedBallLocation.y) / 100) * 650,
      }
    : null;

  return (
    <svg
      viewBox="0 0 1000 750"
      className={className}
      role="img"
      aria-label="Fenway Park baseball field diagram"
    >
      <defs>
        <linearGradient id="skyGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a3a5c" />
          <stop offset="100%" stopColor="#2d5a8a" />
        </linearGradient>

        <pattern id="mowStripes" patternUnits="userSpaceOnUse" width="40" height="40">
          <rect width="40" height="20" fill="#2d8a4e" />
          <rect y="20" width="40" height="20" fill="#34975a" />
        </pattern>

        <pattern id="dirtTexture" patternUnits="userSpaceOnUse" width="8" height="8">
          <rect width="8" height="8" fill="#c4956a" />
          <circle cx="2" cy="2" r="0.5" fill="#b8875c" opacity="0.4" />
          <circle cx="6" cy="5" r="0.5" fill="#d4a57a" opacity="0.3" />
        </pattern>

        <filter id="highlightGlow">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <radialGradient id="ballGradient" cx="40%" cy="35%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#e0e0e0" />
        </radialGradient>

        <filter id="ballShadow">
          <feDropShadow dx="1" dy="1" stdDeviation="2" floodOpacity="0.4" />
        </filter>

        <clipPath id="fieldClip">
          <rect x="0" y="0" width="1000" height="750" />
        </clipPath>
      </defs>

      <g clipPath="url(#fieldClip)">
        {/* Sky */}
        <rect width="1000" height="750" fill="url(#skyGradient)" />

        {/* Outfield grass with mow stripes */}
        <ellipse cx="500" cy="700" rx="520" ry="560" fill="url(#mowStripes)" />

        {/* Fenway asymmetric outfield wall */}
        <path
          d={`
            M 80,350
            L 80,180
            L 85,120
            L 150,60
            L 280,20
            L 380,8
            L 460,5
            L 540,5
            L 600,10
            L 680,30
            L 750,60
            L 820,120
            L 870,200
            L 900,320
            L 910,400
          `}
          fill="none"
          stroke="#0a3622"
          strokeWidth="6"
        />

        {/* Green Monster - left field wall (tall) */}
        <path
          d="M 80,350 L 80,180 L 85,120 L 150,60 L 280,20 L 340,12"
          fill="none"
          stroke="#0a5c2e"
          strokeWidth="18"
        />

        {/* Monster wall face */}
        <path
          d={`
            M 80,350 L 80,280
            L 80,180 L 85,120 L 150,60 L 280,20 L 340,12
            L 340,52
            L 280,60 L 150,100 L 85,160 L 80,220
            Z
          `}
          fill="#0a5c2e"
          opacity="0.85"
        />

        {/* Scoreboard on the Monster */}
        <rect x="120" y="90" width="160" height="55" rx="2" fill="#0a4a24" stroke="#073d1c" strokeWidth="1" />
        {/* Scoreboard grid lines */}
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <line
            key={`sb-v-${i}`}
            x1={120 + i * 17.8}
            y1="100"
            x2={120 + i * 17.8}
            y2="135"
            stroke="#073d1c"
            strokeWidth="0.5"
          />
        ))}
        <line x1="120" y1="118" x2="280" y2="118" stroke="#073d1c" strokeWidth="0.5" />

        {/* Pesky Pole - right field foul pole */}
        <line x1="908" y1="380" x2="908" y2="340" stroke="#e8c72e" strokeWidth="3" />
        <circle cx="908" cy="338" r="4" fill="#e8c72e" />

        {/* Left field foul pole */}
        <line x1="82" y1="350" x2="82" y2="310" stroke="#e8c72e" strokeWidth="3" />
        <circle cx="82" cy="308" r="4" fill="#e8c72e" />

        {/* Warning track */}
        <path
          d={`
            M 100,360
            L 100,200
            L 105,140
            L 170,80
            L 300,40
            L 400,28
            L 470,25
            L 540,25
            L 610,30
            L 700,50
            L 770,80
            L 840,140
            L 885,220
            L 895,340
          `}
          fill="none"
          stroke="#b8875c"
          strokeWidth="16"
          opacity="0.5"
        />

        {/* Infield dirt - full area */}
        <path
          d={`
            M 500,700
            L 310,510
            L 340,400
            L 420,340
            L 500,320
            L 580,340
            L 660,400
            L 690,510
            Z
          `}
          fill="url(#dirtTexture)"
        />

        {/* Infield grass (center cutout) */}
        <path
          d={`
            M 500,540
            L 420,470
            L 430,400
            L 500,370
            L 570,400
            L 580,470
            Z
          `}
          fill="url(#mowStripes)"
        />

        {/* Base paths */}
        <line x1="500" y1="660" x2="620" y2="530" stroke="#ffffff" strokeWidth="2" opacity="0.9" />
        <line x1="620" y1="530" x2="500" y2="400" stroke="#ffffff" strokeWidth="2" opacity="0.9" />
        <line x1="500" y1="400" x2="380" y2="530" stroke="#ffffff" strokeWidth="2" opacity="0.9" />
        <line x1="380" y1="530" x2="500" y2="660" stroke="#ffffff" strokeWidth="2" opacity="0.9" />

        {/* Foul lines extending to walls */}
        <line x1="500" y1="660" x2="82" y2="350" stroke="#ffffff" strokeWidth="2" opacity="0.7" />
        <line x1="500" y1="660" x2="908" y2="380" stroke="#ffffff" strokeWidth="2" opacity="0.7" />

        {/* Pitcher's mound */}
        <ellipse cx="500" cy="510" rx="22" ry="16" fill="#c4956a" />
        <rect x="492" y="507" width="16" height="3" rx="1" fill="#ffffff" />

        {/* Home plate */}
        <polygon points="500,670 492,662 492,655 508,655 508,662" fill="#ffffff" />

        {/* Batter's boxes */}
        <rect x="470" y="648" width="18" height="30" fill="none" stroke="#ffffff" strokeWidth="1" opacity="0.6" />
        <rect x="512" y="648" width="18" height="30" fill="none" stroke="#ffffff" strokeWidth="1" opacity="0.6" />

        {/* First base */}
        <rect x="613" y="523" width="14" height="14" fill="#ffffff" transform="rotate(45,620,530)" />

        {/* Second base */}
        <rect x="493" y="393" width="14" height="14" fill="#ffffff" transform="rotate(45,500,400)" />

        {/* Third base */}
        <rect x="373" y="523" width="14" height="14" fill="#ffffff" transform="rotate(45,380,530)" />

        {/* On-deck circles */}
        <circle cx="440" cy="700" r="12" fill="none" stroke="#ffffff" strokeWidth="1" opacity="0.4" />
        <circle cx="560" cy="700" r="12" fill="none" stroke="#ffffff" strokeWidth="1" opacity="0.4" />

        {/* Outs indicator */}
        <g transform="translate(30, 680)">
          <text x="0" y="0" fill="#ffffff" fontSize="14" fontFamily="sans-serif" fontWeight="bold" opacity="0.9">
            OUTS
          </text>
          {[0, 1, 2].map((i) => (
            <circle
              key={`out-${i}`}
              cx={12 + i * 20}
              cy={14}
              r={7}
              fill={i < fieldState.outs ? "#e8c72e" : "transparent"}
              stroke="#e8c72e"
              strokeWidth="2"
            />
          ))}
        </g>

        {/* Fielder position markers */}
        {Object.entries(FIELDER_POSITIONS).map(([pos, coords]) => (
          <FieldPositionMarker
            key={pos}
            x={coords.x}
            y={coords.y}
            label={coords.label}
            highlighted={fieldState.highlightPlayer === pos}
            type="fielder"
          />
        ))}

        {/* Runner markers */}
        {fieldState.runners.map((base) => {
          const pos = RUNNER_POSITIONS[base];
          return (
            <FieldPositionMarker
              key={`runner-${base}`}
              x={pos.x}
              y={pos.y}
              label=""
              highlighted={false}
              type="runner"
            />
          );
        })}

        {/* Batter at the plate */}
        <FieldPositionMarker
          x={516}
          y={660}
          label=""
          highlighted={false}
          type="batter"
        />

        {/* Batted ball indicator */}
        {ballPos && (
          <g filter="url(#ballShadow)">
            <circle cx={ballPos.x} cy={ballPos.y} r="8" fill="url(#ballGradient)" />
            <path
              d={`M ${ballPos.x - 4},${ballPos.y - 2} Q ${ballPos.x},${ballPos.y - 6} ${ballPos.x + 4},${ballPos.y - 2}`}
              fill="none"
              stroke="#cc0000"
              strokeWidth="1"
            />
            <path
              d={`M ${ballPos.x - 3},${ballPos.y + 3} Q ${ballPos.x},${ballPos.y + 7} ${ballPos.x + 3},${ballPos.y + 3}`}
              fill="none"
              stroke="#cc0000"
              strokeWidth="1"
            />
          </g>
        )}

        {/* Fenway "seats" behind the wall - subtle */}
        <path
          d={`
            M 60,350
            L 60,170
            L 65,105
            L 135,45
            L 265,5
            L 370,-5
            L 460,-10
            L 540,-10
            L 610,-5
            L 700,15
            L 770,45
            L 845,105
            L 895,195
            L 925,320
            L 930,410
          `}
          fill="none"
          stroke="#1a1a2e"
          strokeWidth="30"
          opacity="0.3"
        />
      </g>
    </svg>
  );
}
