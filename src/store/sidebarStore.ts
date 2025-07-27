// stores/sidebarStore.ts
import { create } from 'zustand';

interface SidebarStore {
  isVisible: boolean;
  setIsVisible: (isVisible: boolean) => void;
  toggleSidebar: () => void;
}

export const useSidebarStore = create<SidebarStore>((set) => ({
  isVisible: false,
  setIsVisible: (isVisible) => set({ isVisible }),
  toggleSidebar: () => set((state) => ({ isVisible: !state.isVisible })),
}));