import { create } from "zustand";

interface AppState {
  selectedProjectId: number | null;
  sidebarOpen: boolean;
  setSelectedProjectId: (id: number | null) => void;
  toggleSidebar: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  selectedProjectId: null,
  sidebarOpen: true,
  setSelectedProjectId: (id) => set({ selectedProjectId: id }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
}));
