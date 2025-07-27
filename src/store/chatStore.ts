import { create } from "zustand";
interface ChatPanelStore {
  isOpen: boolean;
  queryInput: string;
  open: () => void;
  close: () => void;
  toggle: () => void;
  setQueryInput: (text: string) => void;
  clearInput: () => void;
}


export const useChatPanelStore = create<ChatPanelStore>((set) => ({
    isOpen: false,
    queryInput: '',
    open: () => set({ isOpen: true }),
    close: () => set({ isOpen: false }),
    toggle: () => set((state) => ({ isOpen: !state.isOpen })),
    setQueryInput: (text) => set({ queryInput: text }),
    clearInput: () => set({ queryInput: '' }),
  }));
  