import { create } from 'zustand'
import type { Project } from '../types'

interface AppState {
  selectedProjectId: string | null
  selectedProject: Project | null
  sidebarOpen: boolean
  setSelectedProject: (project: Project | null) => void
  toggleSidebar: () => void
}

const useAppStore = create<AppState>((set) => ({
  selectedProjectId: null,
  selectedProject: null,
  sidebarOpen: true,
  setSelectedProject: (project) =>
    set({
      selectedProject,
      selectedProjectId: project?.id ?? null,
    }),
  toggleSidebar: () =>
    set((state) => ({
      sidebarOpen: !state.sidebarOpen,
    })),
}))

export default useAppStore
