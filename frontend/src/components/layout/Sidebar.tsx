import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  Bot,
  ChevronDown,
  ChevronRight,
  FileText,
  Folders,
  GitBranch,
  LayoutDashboard,
  Settings,
  TestTube,
  Wrench,
} from 'lucide-react'
import useAppStore from '../../store'
import type { Project } from '../../types'

const projectOptions: Project[] = [
  { id: 'sap-core', name: 'S/4HANA Core' },
  { id: 'sap-greenfield', name: 'S/4HANA Greenfield' },
  { id: 'sap-rollout', name: 'Global Rollout' },
]

const navItems = [
  { label: 'Cockpit', icon: LayoutDashboard, path: '/' },
  { label: 'Projects', icon: Folders, path: '/projects' },
  { label: 'Scenarios', icon: GitBranch, path: '/scenarios' },
  { label: 'Analysis', icon: FileText, path: '/analysis' },
  { label: 'Requirements', icon: FileText, path: '/requirements' },
  { label: 'WRICEF', icon: Wrench, path: '/wricef' },
  { label: 'Config Items', icon: Settings, path: '/config' },
]

const testItems = [
  { label: 'Unit Tests', path: '/tests/unit' },
  { label: 'SIT', path: '/tests/sit' },
  { label: 'UAT', path: '/tests/uat' },
  { label: 'Test Cycles', path: '/tests/cycles' },
]

const baseItem =
  'flex items-center gap-3 border-l-2 border-transparent px-4 py-2 text-sm font-medium transition'

export default function Sidebar() {
  const location = useLocation()
  const [testsOpen, setTestsOpen] = useState(false)
  const sidebarOpen = useAppStore((state) => state.sidebarOpen)
  const selectedProjectId = useAppStore((state) => state.selectedProjectId)
  const setSelectedProject = useAppStore((state) => state.setSelectedProject)

  useEffect(() => {
    if (location.pathname.startsWith('/tests')) {
      setTestsOpen(true)
    }
  }, [location.pathname])

  useEffect(() => {
    if (!selectedProjectId && projectOptions.length > 0) {
      setSelectedProject(projectOptions[0])
    }
  }, [selectedProjectId, setSelectedProject])

  const activeItemClass = `${baseItem} bg-sidebar-active text-white border-primary`
  const inactiveItemClass = `${baseItem} text-gray-300 hover:bg-sidebar-hover hover:text-white`

  return (
    <aside
      className={`flex h-full flex-col border-r border-sidebar-border bg-sidebar-bg text-white transition ${
        sidebarOpen ? 'w-60' : 'w-0 overflow-hidden'
      }`}
    >
      <div className="border-b border-sidebar-border px-4 py-5">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-400 to-purple-500 text-lg font-semibold text-white">
            PC
          </span>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-semibold">ProjektCoPilot</span>
              <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                v2
              </span>
            </div>
            <span className="text-xs text-gray-400">SAP Project Command</span>
          </div>
        </div>
        <div className="mt-4">
          <label className="text-xs text-gray-400" htmlFor="project-select">
            Project
          </label>
          <select
            className="mt-1 w-full rounded-lg border border-sidebar-border bg-sidebar-hover px-3 py-2 text-sm text-white outline-none"
            id="project-select"
            onChange={(event) => {
              const project = projectOptions.find(
                (item) => item.id === event.target.value,
              )
              setSelectedProject(project ?? null)
            }}
            value={selectedProjectId ?? projectOptions[0]?.id}
          >
            {projectOptions.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-2 py-4">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.label}
              className={({ isActive }) =>
                isActive ? activeItemClass : inactiveItemClass
              }
              end={item.path === '/'}
              to={item.path}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </NavLink>
          )
        })}

        <button
          className={
            location.pathname.startsWith('/tests')
              ? activeItemClass
              : inactiveItemClass
          }
          onClick={() => setTestsOpen((open) => !open)}
          type="button"
        >
          <TestTube className="h-4 w-4" />
          <span className="flex-1 text-left">Test Management</span>
          {testsOpen ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>

        {testsOpen && (
          <div className="space-y-1 pl-6">
            {testItems.map((item) => (
              <NavLink
                key={item.label}
                className={({ isActive }) =>
                  isActive
                    ? 'flex items-center gap-2 rounded-md bg-sidebar-active px-3 py-2 text-xs font-semibold text-white'
                    : 'flex items-center gap-2 rounded-md px-3 py-2 text-xs font-medium text-gray-300 hover:bg-sidebar-hover hover:text-white'
                }
                to={item.path}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                {item.label}
              </NavLink>
            ))}
          </div>
        )}

        <NavLink
          className={({ isActive }) =>
            isActive ? activeItemClass : inactiveItemClass
          }
          to="/ai"
        >
          <Bot className="h-4 w-4" />
          <span>AI Co-Pilot</span>
        </NavLink>
      </nav>

      <div className="border-t border-sidebar-border px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-sm font-semibold">
            US
          </div>
          <div>
            <div className="text-sm font-semibold">Umut S.</div>
            <div className="text-xs text-gray-400">Admin</div>
          </div>
        </div>
      </div>
    </aside>
  )
}
