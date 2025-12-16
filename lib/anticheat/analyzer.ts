interface SessionLog {
  questionId: string;
  timeSpentMs: number;
  backspaceCount: number;
  focusLostCount: number;
  answerChanged: boolean;
}

interface AnalysisResult {
  trustScore: number;
  flags: string[];
  action: 'ALLOW' | 'THROTTLE' | 'SHADOW_BAN';
}

const THRESHOLDS = {
  MIN_TIME_PER_QUESTION_MS: 500,
  MIN_BACKSPACES_RATIO: 0.1,
  MAX_FOCUS_LOST: 10,
};

export function analyzeSession(logs: SessionLog[]): AnalysisResult {
  const flags: string[] = [];
  let penaltyPoints = 0;

  const speedViolations = logs.filter((l) => l.timeSpentMs < THRESHOLDS.MIN_TIME_PER_QUESTION_MS);
  if (speedViolations.length > logs.length * 0.5) {
    flags.push('SPEED_VIOLATION');
    penaltyPoints += 30;
  }

  const noBackspaceCount = logs.filter((l) => l.backspaceCount === 0).length;
  if (noBackspaceCount > logs.length * 0.8 && logs.length > 10) {
    flags.push('NO_TYPING_PATTERN');
    penaltyPoints += 25;
  }

  const totalFocusLost = logs.reduce((sum, l) => sum + l.focusLostCount, 0);
  if (totalFocusLost > THRESHOLDS.MAX_FOCUS_LOST) {
    flags.push('EXCESSIVE_TAB_SWITCHING');
    penaltyPoints += 15;
  }

  const trustScore = Math.max(0, 100 - penaltyPoints);

  let action: AnalysisResult['action'] = 'ALLOW';
  if (trustScore < 30) action = 'SHADOW_BAN';
  else if (trustScore < 60) action = 'THROTTLE';

  return { trustScore, flags, action };
}

export function calculateTrustScoreAdjustment(
  currentScore: number,
  analysisResult: AnalysisResult
): number {
  const delta = analysisResult.trustScore - 50;
  const adjustment = Math.round(delta * 0.1);
  return Math.max(0, Math.min(100, currentScore + adjustment));
}

export function shouldShadowBan(trustScore: number): boolean {
  return trustScore < 30;
}
