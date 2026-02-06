import { useEffect, useState } from 'react'
import { Clock } from 'lucide-react'

interface DashboardStats {
  projects: number
  scenarios: number
  requirements: number
  open_gaps: number
  wricef_items: number
  config_items: number
  test_cases: number
}

const recentActivity = [
  {
    title: 'Blueprint review scheduled',
    detail: 'SAP Finance, Wave 1',
    time: '2 hours ago',
  },
  {
    title: 'WRICEF inventory updated',
    detail: '42 items tagged',
    time: 'Yesterday',
  },
  {
    title: 'Testing cycle opened',
    detail: 'SIT Cycle 03',
    time: '2 days ago',
  },
]

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good Morning'
  if (hour < 18) return 'Good Afternoon'
  return 'Good Evening'
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    let isMounted = true

    fetch('/api/v1/dashboard/stats')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Stats fetch failed')
        }
        return res.json()
      })
      .then((data: DashboardStats) => {
        if (!isMounted) return
        setStats(data)
        setHasError(false)
      })
      .catch(() => {
        if (!isMounted) return
        setHasError(true)
      })

    return () => {
      isMounted = false
    }
  }, [])

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  })

  const resolveValue = (value?: number) => {
    if (hasError) return '—'
    if (!stats) return '...'
    return value ?? '—'
  }

  const statCards = [
    {
      label: 'Projects',
      value: resolveValue(stats?.projects),
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      label: 'Scenarios',
      value: resolveValue(stats?.scenarios),
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      label: 'Requirements',
      value: resolveValue(stats?.requirements),
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
    {
      label: 'Open Gaps',
      value: resolveValue(stats?.open_gaps),
      color: 'text-red-600',
      bg: 'bg-red-50',
    },
    {
      label: 'WRICEF Items',
      value: resolveValue(stats?.wricef_items),
      color: 'text-orange-600',
      bg: 'bg-orange-50',
    },
    {
      label: 'Config Items',
      value: resolveValue(stats?.config_items),
      color: 'text-teal-600',
      bg: 'bg-teal-50',
    },
    {
      label: 'Test Cases',
      value: resolveValue(stats?.test_cases),
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            {getGreeting()}, Umut 👋
          </h1>
          <p className="text-sm text-gray-500">
            Welcome to ProjektCoPilot v2 — Your SAP Project Command Center
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm text-gray-600 shadow-sm">
          <Clock className="h-4 w-4" />
          {today}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl bg-white p-5 shadow-sm transition hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="mt-2 text-2xl font-semibold text-gray-900">
                  {stat.value}
                </p>
              </div>
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full ${stat.bg}`}
              >
                <span className={`text-sm font-semibold ${stat.color}`}>*</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
          <button
            className="text-sm font-medium text-primary hover:text-primary/80"
            type="button"
          >
            View all
          </button>
        </div>
        <div className="mt-4 space-y-4">
          {recentActivity.map((item) => (
            <div
              key={item.title}
              className="flex items-center justify-between rounded-lg border border-gray-100 p-4"
            >
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {item.title}
                </p>
                <p className="text-xs text-gray-500">{item.detail}</p>
              </div>
              <span className="text-xs text-gray-400">{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
