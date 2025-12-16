export const LEAGUES = {
  BRONZE: { name: 'Bronze', minXP: 0, maxXP: 999, color: '#CD7F32' },
  SILVER: { name: 'Silver', minXP: 1000, maxXP: 4999, color: '#C0C0C0' },
  GOLD: { name: 'Gold', minXP: 5000, maxXP: 9999, color: '#FFD700' },
  DIAMOND: { name: 'Diamond', minXP: 10000, maxXP: Infinity, color: '#B9F2FF' },
} as const;

export type LeagueName = keyof typeof LEAGUES;

export function getLeagueFromXP(xp: number): LeagueName {
  if (xp >= 10000) return 'DIAMOND';
  if (xp >= 5000) return 'GOLD';
  if (xp >= 1000) return 'SILVER';
  return 'BRONZE';
}

export function getLeagueProgress(xp: number): { current: number; max: number; percent: number } {
  const league = getLeagueFromXP(xp);
  const { minXP, maxXP } = LEAGUES[league];

  if (league === 'DIAMOND') {
    return { current: xp, max: xp, percent: 100 };
  }

  const current = xp - minXP;
  const max = maxXP - minXP + 1;
  const percent = Math.min(100, Math.round((current / max) * 100));

  return { current, max, percent };
}

export function getNextLeague(currentLeague: LeagueName): LeagueName | null {
  const order: LeagueName[] = ['BRONZE', 'SILVER', 'GOLD', 'DIAMOND'];
  const currentIndex = order.indexOf(currentLeague);
  return currentIndex < order.length - 1 ? order[currentIndex + 1] : null;
}

export function getXPToNextLeague(xp: number): number | null {
  const league = getLeagueFromXP(xp);
  const nextLeague = getNextLeague(league);
  if (!nextLeague) return null;
  return LEAGUES[nextLeague].minXP - xp;
}
