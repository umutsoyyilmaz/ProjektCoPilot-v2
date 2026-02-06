import { useEffect, useState, type ChangeEvent } from 'react'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import DataTable from '../components/ui/DataTable'
import Modal from '../components/ui/Modal'

interface Project {
  id: number
  project_name: string
}

interface Scenario {
  id: number
  scenario_id: string
  name: string
  module?: string
  description?: string
  status?: string
  priority?: string
  project_id: number
  is_composite?: number
}

interface ScenarioForm {
  scenario_id: string
  name: string
  module: string
  description: string
  status: string
  priority: string
  project_id: number | ''
}

const emptyForm: ScenarioForm = {
  scenario_id: '',
  name: '',
  module: 'SD',
  description: '',
  status: 'draft',
  priority: 'medium',
  project_id: '',
}

const statusVariant = (status?: string) => {
  if (status === 'active') return 'success'
  if (status === 'completed') return 'info'
  return 'default'
}

const priorityVariant = (priority?: string) => {
  if (priority === 'high') return 'danger'
  if (priority === 'medium') return 'warning'
  if (priority === 'low') return 'info'
  return 'default'
}

const modules = ['SD', 'MM', 'FI', 'CO', 'PP', 'PM', 'HR', 'QM', 'WM', 'Other']

export default function Scenarios() {
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null)
  const [scenarios, setScenarios] = useState<Scenario[]>([])
  const [loading, setLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingScenario, setEditingScenario] = useState<Scenario | null>(null)
  const [formData, setFormData] = useState<ScenarioForm>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/v1/projects')
      const data = await response.json()
      const list = Array.isArray(data) ? data : []
      setProjects(list)
      if (!selectedProjectId && list.length > 0) {
        setSelectedProjectId(list[0].id)
      }
    } catch {
      setProjects([])
    }
  }

  const fetchScenarios = async (projectId: number | null) => {
    if (!projectId) {
      setScenarios([])
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/v1/scenarios?project_id=${projectId}`)
      const data = await response.json()
      setScenarios(Array.isArray(data) ? data : [])
    } catch {
      setScenarios([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  useEffect(() => {
    fetchScenarios(selectedProjectId)
  }, [selectedProjectId])

  const openNewModal = () => {
    setEditingScenario(null)
    setFormData({
      ...emptyForm,
      project_id: selectedProjectId ?? projects[0]?.id ?? '',
    })
    setIsModalOpen(true)
  }

  const openEditModal = (scenario: Scenario) => {
    setEditingScenario(scenario)
    setFormData({
      scenario_id: scenario.scenario_id ?? '',
      name: scenario.name ?? '',
      module: scenario.module ?? 'SD',
      description: scenario.description ?? '',
      status: scenario.status ?? 'draft',
      priority: scenario.priority ?? 'medium',
      project_id: scenario.project_id ?? selectedProjectId ?? '',
    })
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingScenario(null)
    setFormData(emptyForm)
  }

  const handleChange = (field: keyof ScenarioForm) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const value = field === 'project_id' ? Number(event.target.value) : event.target.value
      setFormData((prev) => ({ ...prev, [field]: value }))
    }

  const handleSave = async () => {
    setSaving(true)
    try {
      const url = editingScenario
        ? `/api/v1/scenarios/${editingScenario.id}`
        : '/api/v1/scenarios'
      const method = editingScenario ? 'PUT' : 'POST'

      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      await fetchScenarios(selectedProjectId)
      closeModal()
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!editingScenario) return
    setDeleting(true)
    try {
      await fetch(`/api/v1/scenarios/${editingScenario.id}`, { method: 'DELETE' })
      await fetchScenarios(selectedProjectId)
      closeModal()
    } finally {
      setDeleting(false)
    }
  }

  const columns = [
    { key: 'scenario_id', label: 'ID' },
    {
      key: 'name',
      label: 'Name',
      render: (row: Scenario) => (
        <span className="font-semibold text-gray-900">{row.name}</span>
      ),
    },
    { key: 'module', label: 'Module' },
    {
      key: 'status',
      label: 'Status',
      render: (row: Scenario) => (
        <Badge text={row.status ?? 'draft'} variant={statusVariant(row.status)} />
      ),
    },
    {
      key: 'priority',
      label: 'Priority',
      render: (row: Scenario) => (
        <Badge text={row.priority ?? 'medium'} variant={priorityVariant(row.priority)} />
      ),
    },
    {
      key: 'is_composite',
      label: 'Composite',
      render: (row: Scenario) => (row.is_composite ? 'Yes' : 'No'),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-semibold text-gray-900">Scenarios</h1>
          <select
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
            onChange={(event) => setSelectedProjectId(Number(event.target.value))}
            value={selectedProjectId ?? ''}
          >
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.project_name}
              </option>
            ))}
          </select>
        </div>
        <Button onClick={openNewModal}>New Scenario</Button>
      </div>

      <DataTable
        columns={columns}
        data={scenarios}
        loading={loading}
        onRowClick={openEditModal}
        emptyMessage="No scenarios yet"
      />

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingScenario ? 'Edit Scenario' : 'New Scenario'}
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-gray-700">Scenario ID</label>
              <input
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                onChange={handleChange('scenario_id')}
                value={formData.scenario_id}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Name</label>
              <input
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                onChange={handleChange('name')}
                value={formData.name}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Module</label>
              <select
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                onChange={handleChange('module')}
                value={formData.module}
              >
                {modules.map((module) => (
                  <option key={module} value={module}>
                    {module}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Project</label>
              <select
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                onChange={handleChange('project_id')}
                value={formData.project_id}
              >
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.project_name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Status</label>
              <select
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                onChange={handleChange('status')}
                value={formData.status}
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Priority</label>
              <select
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                onChange={handleChange('priority')}
                value={formData.priority}
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
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
          <div className="flex items-center justify-between">
            {editingScenario ? (
              <Button
                variant="danger"
                onClick={handleDelete}
                loading={deleting}
              >
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
    </div>
  )
}
