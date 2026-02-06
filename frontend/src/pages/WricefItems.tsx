import { useEffect, useState, type ChangeEvent } from 'react'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import DataTable from '../components/ui/DataTable'
import Modal from '../components/ui/Modal'

interface Project {
  id: number
  project_name: string
}

interface WricefItem {
  id: number
  code?: string
  title: string
  wricef_type?: string
  status?: string
  priority?: string
  description?: string
  requirement_id?: number
  scenario_id?: number
  project_id?: number
  functional_spec?: string
  technical_spec?: string
  unit_test_steps?: string
}

interface WricefForm {
  code: string
  title: string
  wricef_type: string
  status: string
  priority: string
  description: string
  requirement_id: string
  scenario_id: string
  project_id: string
  functional_spec: string
  technical_spec: string
  unit_test_steps: string
}

const emptyForm: WricefForm = {
  code: '',
  title: '',
  wricef_type: 'E',
  status: 'identified',
  priority: 'medium',
  description: '',
  requirement_id: '',
  scenario_id: '',
  project_id: '',
  functional_spec: '',
  technical_spec: '',
  unit_test_steps: '',
}

const statusVariant = (status?: string) => {
  if (status === 'identified') return 'info'
  if (status === 'in_progress') return 'warning'
  if (status === 'completed') return 'success'
  return 'default'
}

const priorityVariant = (priority?: string) => {
  if (priority === 'high') return 'danger'
  if (priority === 'medium') return 'warning'
  if (priority === 'low') return 'info'
  return 'default'
}

const typeClasses: Record<string, string> = {
  W: 'bg-[#3b82f6]',
  R: 'bg-[#7c3aed]',
  I: 'bg-[#f97316]',
  C: 'bg-[#06b6d4]',
  E: 'bg-[#22c55e]',
  F: 'bg-[#ef4444]',
}

const tabButtonClass = (active: boolean) =>
  `border-b-2 px-3 py-2 text-sm ${active ? 'border-blue-500 font-semibold text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`

type TabKey = 'basic' | 'functional' | 'technical' | 'unit'

export default function WricefItems() {
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProjectId, setSelectedProjectId] = useState<number | 'all'>('all')
  const [items, setItems] = useState<WricefItem[]>([])
  const [loading, setLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<TabKey>('basic')
  const [editingItem, setEditingItem] = useState<WricefItem | null>(null)
  const [formData, setFormData] = useState<WricefForm>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [detailLoading, setDetailLoading] = useState(false)
  const [converting, setConverting] = useState(false)
  const [convertMessage, setConvertMessage] = useState('')

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/v1/projects')
      const data = await response.json()
      setProjects(Array.isArray(data) ? data : [])
    } catch {
      setProjects([])
    }
  }

  const fetchItems = async () => {
    setLoading(true)
    try {
      const query =
        selectedProjectId === 'all' ? '' : `?project_id=${selectedProjectId}`
      const response = await fetch(`/api/v1/wricef-items${query}`)
      const data = await response.json()
      setItems(Array.isArray(data) ? data : [])
    } catch {
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  useEffect(() => {
    fetchItems()
  }, [selectedProjectId])

  const projectName = (id?: number) =>
    projects.find((project) => project.id === id)?.project_name ?? '—'

  const fillFormFromItem = (item: WricefItem) => {
    setFormData({
      code: item.code ?? '',
      title: item.title ?? '',
      wricef_type: item.wricef_type ?? 'E',
      status: item.status ?? 'identified',
      priority: item.priority ?? 'medium',
      description: item.description ?? '',
      requirement_id: item.requirement_id ? String(item.requirement_id) : '',
      scenario_id: item.scenario_id ? String(item.scenario_id) : '',
      project_id: item.project_id ? String(item.project_id) : '',
      functional_spec: item.functional_spec ?? '',
      technical_spec: item.technical_spec ?? '',
      unit_test_steps: item.unit_test_steps ?? '',
    })
  }

  const openNewModal = () => {
    setEditingItem(null)
    setActiveTab('basic')
    setFormData({
      ...emptyForm,
      project_id: selectedProjectId === 'all' ? '' : String(selectedProjectId),
    })
    setConvertMessage('')
    setIsModalOpen(true)
  }

  const openEditModal = async (item: WricefItem) => {
    setEditingItem(item)
    setActiveTab('basic')
    setIsModalOpen(true)
    setDetailLoading(true)
    setConvertMessage('')
    try {
      const response = await fetch(`/api/v1/wricef-items/${item.id}`)
      if (!response.ok) {
        throw new Error('Failed to load')
      }
      const data = (await response.json()) as WricefItem
      setEditingItem(data)
      fillFormFromItem(data)
    } catch {
      fillFormFromItem(item)
    } finally {
      setDetailLoading(false)
    }
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingItem(null)
    setFormData(emptyForm)
    setActiveTab('basic')
    setConvertMessage('')
  }

  const handleChange = (field: keyof WricefForm) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setFormData((prev) => ({ ...prev, [field]: event.target.value }))
    }

  const buildPayload = () => ({
    code: formData.code || undefined,
    title: formData.title,
    wricef_type: formData.wricef_type,
    status: formData.status,
    priority: formData.priority || undefined,
    description: formData.description || undefined,
    requirement_id: formData.requirement_id ? Number(formData.requirement_id) : undefined,
    scenario_id: formData.scenario_id ? Number(formData.scenario_id) : undefined,
    project_id: formData.project_id ? Number(formData.project_id) : undefined,
    functional_spec: formData.functional_spec || undefined,
    technical_spec: formData.technical_spec || undefined,
    unit_test_steps: formData.unit_test_steps || undefined,
  })

  const handleSave = async () => {
    setSaving(true)
    try {
      const url = editingItem
        ? `/api/v1/wricef-items/${editingItem.id}`
        : '/api/v1/wricef-items'
      const method = editingItem ? 'PUT' : 'POST'

      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildPayload()),
      })

      await fetchItems()
      closeModal()
    } finally {
      setSaving(false)
    }
  }

  const handleSaveSection = async () => {
    if (!editingItem) return
    setSaving(true)
    try {
      await fetch(`/api/v1/wricef-items/${editingItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildPayload()),
      })
      await fetchItems()
    } finally {
      setSaving(false)
    }
  }

  const handleConvert = async () => {
    if (!editingItem) return
    setConverting(true)
    setConvertMessage('')
    try {
      const response = await fetch(
        `/api/v1/wricef-items/${editingItem.id}/convert-to-test`,
        { method: 'POST' },
      )
      if (!response.ok) {
        throw new Error('Conversion failed')
      }
      setConvertMessage('Converted successfully')
    } catch {
      setConvertMessage('Conversion failed')
    } finally {
      setConverting(false)
    }
  }

  const columns = [
    {
      key: 'code',
      label: 'Code',
      render: (row: WricefItem) => row.code ?? `#${row.id}`,
    },
    {
      key: 'title',
      label: 'Title',
      render: (row: WricefItem) => (
        <span className="font-semibold text-gray-900">{row.title}</span>
      ),
    },
    {
      key: 'wricef_type',
      label: 'Type',
      render: (row: WricefItem) => {
        const type = row.wricef_type ?? 'E'
        return (
          <Badge
            text={type}
            variant="default"
            className={typeClasses[type] ?? 'bg-gray-400'}
          />
        )
      },
    },
    {
      key: 'status',
      label: 'Status',
      render: (row: WricefItem) => (
        <Badge text={row.status ?? 'identified'} variant={statusVariant(row.status)} />
      ),
    },
    {
      key: 'priority',
      label: 'Priority',
      render: (row: WricefItem) => (
        <Badge text={row.priority ?? 'medium'} variant={priorityVariant(row.priority)} />
      ),
    },
    {
      key: 'project',
      label: 'Project',
      render: (row: WricefItem) => projectName(row.project_id),
    },
  ]

  const isEditing = Boolean(editingItem)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-semibold text-gray-900">WRICEF Items</h1>
          <select
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
            onChange={(event) => {
              const value = event.target.value
              setSelectedProjectId(value === 'all' ? 'all' : Number(value))
            }}
            value={selectedProjectId}
          >
            <option value="all">All Projects</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.project_name}
              </option>
            ))}
          </select>
        </div>
        <Button onClick={openNewModal}>New WRICEF</Button>
      </div>

      <DataTable
        columns={columns}
        data={items}
        loading={loading}
        onRowClick={openEditModal}
        emptyMessage="No WRICEF items yet"
      />

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={isEditing ? 'WRICEF Details' : 'New WRICEF'}
        size="xl"
      >
        {detailLoading ? (
          <div className="py-8 text-center text-sm text-gray-500">Loading...</div>
        ) : (
          <div className="space-y-4">
            {isEditing ? (
              <div>
                <div className="border-b border-gray-200">
                  <nav className="flex gap-3">
                    <button
                      className={tabButtonClass(activeTab === 'basic')}
                      onClick={() => setActiveTab('basic')}
                      type="button"
                    >
                      Basic Info
                    </button>
                    <button
                      className={tabButtonClass(activeTab === 'functional')}
                      onClick={() => setActiveTab('functional')}
                      type="button"
                    >
                      Functional Spec
                    </button>
                    <button
                      className={tabButtonClass(activeTab === 'technical')}
                      onClick={() => setActiveTab('technical')}
                      type="button"
                    >
                      Technical Spec
                    </button>
                    <button
                      className={tabButtonClass(activeTab === 'unit')}
                      onClick={() => setActiveTab('unit')}
                      type="button"
                    >
                      Unit Test
                    </button>
                  </nav>
                </div>

                {activeTab === 'basic' && (
                  <div className="mt-4 space-y-4">
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
                        <label className="text-sm font-medium text-gray-700">Type</label>
                        <select
                          className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                          onChange={handleChange('wricef_type')}
                          value={formData.wricef_type}
                        >
                          {['W', 'R', 'I', 'C', 'E', 'F'].map((type) => (
                            <option key={type} value={type}>
                              {type}
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
                          <option value="identified">Identified</option>
                          <option value="in_progress">In Progress</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
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
                      <div>
                        <label className="text-sm font-medium text-gray-700">Project</label>
                        <select
                          className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                          onChange={handleChange('project_id')}
                          value={formData.project_id}
                        >
                          <option value="">Select project</option>
                          {projects.map((project) => (
                            <option key={project.id} value={project.id}>
                              {project.project_name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Requirement ID</label>
                        <input
                          className="mt-1 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm"
                          readOnly
                          value={formData.requirement_id}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Scenario ID</label>
                        <input
                          className="mt-1 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm"
                          readOnly
                          value={formData.scenario_id}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Description</label>
                      <textarea
                        className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                        onChange={handleChange('description')}
                        rows={4}
                        value={formData.description}
                      />
                    </div>
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="secondary" onClick={closeModal}>
                        Cancel
                      </Button>
                      <Button onClick={handleSaveSection} loading={saving}>
                        Save
                      </Button>
                    </div>
                  </div>
                )}

                {activeTab === 'functional' && (
                  <div className="mt-4 space-y-4">
                    <textarea
                      className="min-h-[300px] w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                      onChange={handleChange('functional_spec')}
                      value={formData.functional_spec}
                    />
                    <div className="flex justify-end">
                      <Button onClick={handleSaveSection} loading={saving}>
                        Save
                      </Button>
                    </div>
                  </div>
                )}

                {activeTab === 'technical' && (
                  <div className="mt-4 space-y-4">
                    <textarea
                      className="min-h-[300px] w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                      onChange={handleChange('technical_spec')}
                      value={formData.technical_spec}
                    />
                    <div className="flex justify-end">
                      <Button onClick={handleSaveSection} loading={saving}>
                        Save
                      </Button>
                    </div>
                  </div>
                )}

                {activeTab === 'unit' && (
                  <div className="mt-4 space-y-4">
                    <textarea
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                      onChange={handleChange('unit_test_steps')}
                      rows={6}
                      value={formData.unit_test_steps}
                    />
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <Button onClick={handleConvert} loading={converting} size="sm">
                        Convert to Unit Test
                      </Button>
                      {convertMessage && (
                        <span
                          className={`text-sm ${
                            convertMessage === 'Converted successfully'
                              ? 'text-green-600'
                              : 'text-red-600'
                          }`}
                        >
                          {convertMessage}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
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
                    <label className="text-sm font-medium text-gray-700">Type</label>
                    <select
                      className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                      onChange={handleChange('wricef_type')}
                      value={formData.wricef_type}
                    >
                      {['W', 'R', 'I', 'C', 'E', 'F'].map((type) => (
                        <option key={type} value={type}>
                          {type}
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
                      <option value="identified">Identified</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
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
                  <div>
                    <label className="text-sm font-medium text-gray-700">Project</label>
                    <select
                      className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                      onChange={handleChange('project_id')}
                      value={formData.project_id}
                    >
                      <option value="">Select project</option>
                      {projects.map((project) => (
                        <option key={project.id} value={project.id}>
                          {project.project_name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                    onChange={handleChange('description')}
                    rows={4}
                    value={formData.description}
                  />
                </div>
                <div className="flex items-center justify-end gap-2">
                  <Button variant="secondary" onClick={closeModal}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave} loading={saving}>
                    Save
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}
