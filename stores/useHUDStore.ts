import { create } from 'zustand';

interface HUDStore {
  isVisible: boolean;
  setVisible: (visible: boolean) => void;
  toggle: () => void;
}

export const useHUDStore = create<HUDStore>((set) => ({
  isVisible: true,
  setVisible: (visible) => set({ isVisible: visible }),
  toggle: () => set((state) => ({ isVisible: !state.isVisible })),
}));
