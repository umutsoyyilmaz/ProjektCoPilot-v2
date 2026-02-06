import { Bell, Search } from 'lucide-react'

export default function Header() {
  return (
    <header className="flex h-14 items-center justify-between border-b bg-white px-6">
      <div className="flex items-center gap-3">
        <span className="text-lg font-semibold text-gray-900">
          SAP AI Project Co-Pilot
        </span>
        <span className="rounded-full bg-gradient-to-r from-purple-500 to-blue-500 px-2 py-0.5 text-xs font-semibold text-white">
          AI
        </span>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative hidden items-center md:flex">
          <Search className="absolute left-3 h-4 w-4 text-gray-400" />
          <input
            className="h-9 w-64 rounded-full border border-gray-200 bg-gray-50 pl-9 pr-3 text-sm text-gray-700 outline-none transition focus:ring-2 focus:ring-primary/30"
            placeholder="⌘K Search"
            type="text"
          />
        </div>
        <button
          className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition hover:bg-gray-100"
          type="button"
        >
          <Bell className="h-4 w-4" />
        </button>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white">
          US
        </div>
      </div>
    </header>
  )
}
