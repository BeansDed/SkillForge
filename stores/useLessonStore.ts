import { create } from 'zustand';

interface LessonStore {
  isCompleted: boolean;
  currentLessonId: string | null;
  setLessonId: (id: string | null) => void;
  markCompleted: () => void;
  reset: () => void;
}

export const useLessonStore = create<LessonStore>((set) => ({
  isCompleted: false,
  currentLessonId: null,
  setLessonId: (id) => set({ currentLessonId: id, isCompleted: false }),
  markCompleted: () => set({ isCompleted: true }),
  reset: () => set({ isCompleted: false, currentLessonId: null }),
}));
