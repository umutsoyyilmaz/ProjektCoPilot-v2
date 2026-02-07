import { useEffect, useMemo, useState, type ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import DataTable from '../components/ui/DataTable'
import Modal from '../components/ui/Modal'

interface Scenario {
  id: number
  scenario_id?: string
  name: string
}

interface AnalysisItem {
  id: number
  scenario_id?: number | null
  title: string
  analysis_type?: string
  status?: string
  description?: string
  scheduled_date?: string
  completed_date?: string
  created_at?: string
}

interface AnalysisForm {
  title: string
  analysis_type: string
  status: string
  description: string
  scenario_id: number | ''
  scheduled_date: string
  completed_date: string
}

interface SessionItem {
  id: number
  session_code?: string
  session_name: string
  module?: string
  status?: string
}

interface SessionForm {
  session_name: string
  session_code: string
  module: string
  facilitator: string
  status: string
  session_date: string
  location: string
}

const emptyAnalysisForm: AnalysisForm = {
  title: '',
  analysis_type: 'workshop',
  status: 'planned',
  description: '',
  scenario_id: '',
  scheduled_date: '',
  completed_date: '',
}

const emptySessionForm: SessionForm = {
  session_name: '',
  session_code: '',
  module: 'SD',
  facilitator: '',
  status: 'planned',
  session_date: '',
  location: '',
}

const analysisTypeVariant = (analysisType?: string) => {
  if (analysisType === 'workshop') return 'info'
  if (analysisType === 'breakdown') return 'warning'
  if (analysisType === 'review') return 'default'
  return 'default'
}

const analysisStatusVariant = (status?: string) => {
  if (status === 'completed') return 'success'
  if (status === 'in_progress') return 'warning'
  if (status === 'planned') return 'default'
  return 'default'
}

const sessionStatusVariant = (status?: string) => {
  if (status === 'completed') return 'success'
  if (status === 'in_progress') return 'warning'
  if (status === 'planned') return 'default'
  return 'default'
}

const modules = ['SD', 'MM', 'FI', 'CO', 'PP', 'PM', 'HR', 'QM', 'WM', 'Other']

const formatDate = (value?: string) => {
  if (!value) return '-'
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return value
  return parsed.toLocaleDateString()
}

export default function Analysis() {
  const navigate = useNavigate()
  const [scenarios, setScenarios] = useState<Scenario[]>([])
  const [selectedScenarioId, setSelectedScenarioId] = useState<number | 'all'>('all')
  const [analyses, setAnalyses] = useState<AnalysisItem[]>([])
  const [loading, setLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingAnalysis, setEditingAnalysis] = useState<AnalysisItem | null>(null)
  const [formData, setFormData] = useState<AnalysisForm>(emptyAnalysisForm)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const [sessions, setSessions] = useState<SessionItem[]>([])
  const [sessionsLoading, setSessionsLoading] = useState(false)
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false)
  const [sessionForm, setSessionForm] = useState<SessionForm>(emptySessionForm)
  const [sessionSaving, setSessionSaving] = useState(false)

  const scenarioNameById = useMemo(() => {
    return new Map(scenarios.map((scenario) => [scenario.id, scenario.name]))
  }, [scenarios])

  const fetchScenarios = async () => {
    try {
      const response = await fetch('/api/v1/scenarios')
      const data = await response.json()
      setScenarios(Array.isArray(data) ? data : [])
    } catch {
      setScenarios([])
    }
  }

  const fetchAnalyses = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (selectedScenarioId !== 'all') {
        params.set('scenario_id', String(selectedScenarioId))
      }
      const query = params.toString()
      const response = await fetch(`/api/v1/analyses${query ? `?${query}` : ''}`)
      const data = await response.json()
      setAnalyses(Array.isArray(data) ? data : [])
    } catch {
      setAnalyses([])
    } finally {
      setLoading(false)
    }
  }

  const fetchSessions = async (analysisId: number) => {
    setSessionsLoading(true)
    try {
      const response = await fetch(`/api/v1/sessions?analysis_id=${analysisId}`)
      const data = await response.json()
      setSessions(Array.isArray(data) ? data : [])
    } catch {
      setSessions([])
    } finally {
      setSessionsLoading(false)
    }
  }

  useEffect(() => {
    fetchScenarios()
  }, [])

  useEffect(() => {
    fetchAnalyses()
  }, [selectedScenarioId])

  useEffect(() => {
    if (!editingAnalysis?.id) {
      setSessions([])
      return
    }
    fetchSessions(editingAnalysis.id)
  }, [editingAnalysis?.id])

  const openNewModal = () => {
    setEditingAnalysis(null)
    setFormData({
      ...emptyAnalysisForm,
      scenario_id: selectedScenarioId === 'all' ? '' : selectedScenarioId,
    })
    setIsModalOpen(true)
  }

  const openEditModal = (analysis: AnalysisItem) => {
    setEditingAnalysis(analysis)
    setFormData({
      title: analysis.title ?? '',
      analysis_type: analysis.analysis_type ?? 'workshop',
      status: analysis.status ?? 'planned',
      description: analysis.description ?? '',
      scenario_id: analysis.scenario_id ?? '',
      scheduled_date: analysis.scheduled_date ?? '',
      completed_date: analysis.completed_date ?? '',
    })
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingAnalysis(null)
    setFormData(emptyAnalysisForm)
    setSessions([])
  }

  const handleChange = (field: keyof AnalysisForm) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const value =
        field === 'scenario_id'
          ? event.target.value === ''
            ? ''
            : Number(event.target.value)
          : event.target.value
      setFormData((prev) => ({ ...prev, [field]: value }))
    }

  const handleSave = async () => {
    setSaving(true)
    try {
      const url = editingAnalysis
        ? `/api/v1/analyses/${editingAnalysis.id}`
        : '/api/v1/analyses'
      const method = editingAnalysis ? 'PUT' : 'POST'

      const payload = {
        ...formData,
        scenario_id: formData.scenario_id === '' ? null : formData.scenario_id,
      }

      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      await fetchAnalyses()
      closeModal()
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!editingAnalysis) return
    setDeleting(true)
    try {
      await fetch(`/api/v1/analyses/${editingAnalysis.id}`, { method: 'DELETE' })
      await fetchAnalyses()
      closeModal()
    } finally {
      setDeleting(false)
    }
  }

  const openSessionModal = () => {
    setSessionForm(emptySessionForm)
    setIsSessionModalOpen(true)
  }

  const closeSessionModal = () => {
    setIsSessionModalOpen(false)
    setSessionForm(emptySessionForm)
  }

  const handleSessionChange = (field: keyof SessionForm) =>
    (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setSessionForm((prev) => ({ ...prev, [field]: event.target.value }))
    }

  const handleSessionSave = async () => {
    if (!editingAnalysis) return
    setSessionSaving(true)
    try {
      await fetch('/api/v1/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...sessionForm,
          analysis_id: editingAnalysis.id,
          scenario_id: editingAnalysis.scenario_id ?? null,
        }),
      })

      await fetchSessions(editingAnalysis.id)
      closeSessionModal()
    } finally {
      setSessionSaving(false)
    }
  }

  const columns = [
    { key: 'id', label: 'ID' },
    {
      key: 'title',
      label: 'Title',
      render: (row: AnalysisItem) => (
        <span className="font-semibold text-gray-900">{row.title}</span>
      ),
    },
    {
      key: 'analysis_type',
      label: 'Type',
      render: (row: AnalysisItem) => (
        <Badge
          text={row.analysis_type ?? 'workshop'}
          variant={analysisTypeVariant(row.analysis_type)}
        />
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (row: AnalysisItem) => (
        <Badge text={row.status ?? 'planned'} variant={analysisStatusVariant(row.status)} />
      ),
    },
    {
      key: 'scenario_id',
      label: 'Scenario',
      render: (row: AnalysisItem) => (
        <span>{scenarioNameById.get(row.scenario_id ?? 0) ?? 'Unassigned'}</span>
      ),
    },
    {
      key: 'created_at',
      label: 'Created',
      render: (row: AnalysisItem) => <span>{formatDate(row.created_at)}</span>,
    },
  ]

  const sessionColumns = [
    { key: 'session_code', label: 'Code' },
    {
      key: 'session_name',
      label: 'Name',
      render: (row: SessionItem) => (
        <span className="font-semibold text-gray-900">{row.session_name}</span>
      ),
    },
    { key: 'module', label: 'Module' },
    {
      key: 'status',
      label: 'Status',
      render: (row: SessionItem) => (
        <Badge text={row.status ?? 'planned'} variant={sessionStatusVariant(row.status)} />
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-semibold text-gray-900">Analysis</h1>
          <select
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
            onChange={(event) =>
              setSelectedScenarioId(
                event.target.value === 'all' ? 'all' : Number(event.target.value),
              )
            }
            value={selectedScenarioId}
          >
            <option value="all">All Scenarios</option>
            {scenarios.map((scenario) => (
              <option key={scenario.id} value={scenario.id}>
                {scenario.name}
              </option>
            ))}
          </select>
        </div>
        <Button onClick={openNewModal}>New Analysis</Button>
      </div>

      <DataTable
        columns={columns}
        data={analyses}
        loading={loading}
        onRowClick={openEditModal}
        emptyMessage="No analyses yet"
      />

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingAnalysis ? 'Edit Analysis' : 'New Analysis'}
        size="xl"
      >
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-gray-700">Title</label>
              <input
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                onChange={handleChange('title')}
                value={formData.title}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Scenario</label>
              <select
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                onChange={handleChange('scenario_id')}
                value={formData.scenario_id}
              >
                <option value="">Unassigned</option>
                {scenarios.map((scenario) => (
                  <option key={scenario.id} value={scenario.id}>
                    {scenario.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Type</label>
              <select
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                onChange={handleChange('analysis_type')}
                value={formData.analysis_type}
              >
                <option value="workshop">Workshop</option>
                <option value="breakdown">Breakdown</option>
                <option value="review">Review</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Status</label>
              <select
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                onChange={handleChange('status')}
                value={formData.status}
              >
                <option value="planned">Planned</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Scheduled Date</label>
              <input
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                onChange={handleChange('scheduled_date')}
                type="date"
                value={formData.scheduled_date}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Completed Date</label>
              <input
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                onChange={handleChange('completed_date')}
                type="date"
                value={formData.completed_date}
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Description</label>
            <textarea
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
              onChange={handleChange('description')}
              rows={3}
              value={formData.description}
            />
          </div>

          {editingAnalysis && (
            <div className="rounded-lg border border-gray-200 p-4">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-semibold text-gray-900">Sessions</h3>
                <Button size="sm" onClick={openSessionModal}>
                  New Session
                </Button>
              </div>
              <DataTable
                columns={sessionColumns}
                data={sessions}
                loading={sessionsLoading}
                onRowClick={(session) => navigate(`/sessions/${session.id}`)}
                emptyMessage="No sessions yet"
              />
            </div>
          )}

          <div className="flex items-center justify-between">
            {editingAnalysis ? (
              <Button variant="danger" onClick={handleDelete} loading={deleting}>
                Delete
              </Button>
            ) : (
              <span />
            )}
            <div className="flex items-center gap-2">
              <Button variant="secondary" onClick={closeModal}>
                Cancel
              </Button>
              <Button onClick={handleSave} loading={saving}>
                Save
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isSessionModalOpen}
        onClose={closeSessionModal}
        title="New Session"
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-gray-700">Session Name</label>
              <input
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                onChange={handleSessionChange('session_name')}
                value={sessionForm.session_name}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Session Code</label>
              <input
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                onChange={handleSessionChange('session_code')}
                value={sessionForm.session_code}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Module</label>
              <select
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                onChange={handleSessionChange('module')}
                value={sessionForm.module}
              >
                {modules.map((module) => (
                  <option key={module} value={module}>
                    {module}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Facilitator</label>
              <input
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                onChange={handleSessionChange('facilitator')}
                value={sessionForm.facilitator}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Status</label>
              <select
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                onChange={handleSessionChange('status')}
                value={sessionForm.status}
              >
                <option value="planned">Planned</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Session Date</label>
              <input
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                onChange={handleSessionChange('session_date')}
                type="date"
                value={sessionForm.session_date}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Location</label>
              <input
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                onChange={handleSessionChange('location')}
                value={sessionForm.location}
              />
            </div>
          </div>
          <div className="flex items-center justify-end gap-2">
            <Button variant="secondary" onClick={closeSessionModal}>
              Cancel
            </Button>
            <Button onClick={handleSessionSave} loading={sessionSaving}>
              Create Session
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
