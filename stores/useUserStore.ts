import { create } from 'zustand';

interface UserStats {
  xp: number;
  gems: number;
  hearts: number;
  currentStreak: number;
}

interface UserStore extends UserStats {
  setUserStats: (stats: UserStats) => void;
  optimisticUpdate: (partial: Partial<UserStats>) => void;
  addXP: (amount: number) => void;
  addGems: (amount: number) => void;
  spendGems: (amount: number) => boolean;
  loseHeart: () => void;
  refillHearts: () => void;
  incrementStreak: () => void;
  reset: () => void;
}

const initialState: UserStats = {
  xp: 0,
  gems: 500,
  hearts: 5,
  currentStreak: 0,
};

export const useUserStore = create<UserStore>((set, get) => ({
  ...initialState,

  setUserStats: (stats) => set(stats),

  optimisticUpdate: (partial) => set((state) => ({ ...state, ...partial })),

  addXP: (amount) => set((state) => ({ xp: state.xp + amount })),

  addGems: (amount) => set((state) => ({ gems: state.gems + amount })),

  spendGems: (amount) => {
    const { gems } = get();
    if (gems < amount) return false;
    set({ gems: gems - amount });
    return true;
  },

  loseHeart: () => set((state) => ({ hearts: Math.max(0, state.hearts - 1) })),

  refillHearts: () => set({ hearts: 5 }),

  incrementStreak: () => set((state) => ({ currentStreak: state.currentStreak + 1 })),

  reset: () => set(initialState),
}));
