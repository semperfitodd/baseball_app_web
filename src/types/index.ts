export interface ScenarioOption {
  id: string;
  text: string;
}

export interface FieldState {
  runners: ("first" | "second" | "third")[];
  outs: 0 | 1 | 2;
  battedBallLocation?: { x: number; y: number };
  highlightPlayer?: string;
}

export interface Scenario {
  scenarioId: string;
  title: string;
  situation: string;
  playerName: string;
  playerPosition: string;
  options: ScenarioOption[];
  difficulty: "rookie" | "veteran" | "allstar";
  category: "batting" | "baserunning" | "fielding" | "pitching" | "situational";
  fieldState: FieldState;
}

export interface AnswerResult {
  correct: boolean;
  correctOptionId: string;
  explanation: string;
  streak: number;
}

export interface UserProgress {
  userId: string;
  scenarioId: string;
  selectedOptionId: string;
  correct: boolean;
  answeredAt: string;
}

export interface UserStats {
  totalAnswered: number;
  totalCorrect: number;
  streak: number;
  bestStreak: number;
  accuracy: number;
}

export interface LeaderboardEntry {
  userId: string;
  displayName: string;
  totalCorrect: number;
  totalAnswered: number;
}

export interface UserInfo {
  sub: string;
  email: string;
  name: string;
  givenName: string;
  picture?: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  error?: string;
  message?: string;
  [key: string]: T | boolean | string | undefined;
}
