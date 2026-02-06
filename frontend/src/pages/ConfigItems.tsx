import { useEffect, useState, type ChangeEvent } from 'react'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import DataTable from '../components/ui/DataTable'
import Modal from '../components/ui/Modal'

interface Project {
  id: number
  project_name: string
}

interface ConfigItem {
  id: number
  code?: string
  title: string
  config_type?: string
  status?: string
  t_code?: string
  description?: string
  project_id?: number
  config_details?: string
  unit_test_steps?: string
}

interface ConfigForm {
  code: string
  title: string
  config_type: string
  status: string
  description: string
  project_id: string
  t_code: string
  config_details: string
  table_references: string
  unit_test_steps: string
}

const emptyForm: ConfigForm = {
  code: '',
  title: '',
  config_type: 'standard',
  status: 'planned',
  description: '',
  project_id: '',
  t_code: '',
  config_details: '',
  table_references: '',
  unit_test_steps: '',
}

const statusVariant = (status?: string) => {
  if (status === 'planned') return 'info'
  if (status === 'in_progress') return 'warning'
  if (status === 'completed') return 'success'
  return 'default'
}

const configVariant = (type?: string) => {
  if (type === 'standard') return 'info'
  if (type === 'custom') return 'warning'
  if (type === 'enhancement') return 'success'
  return 'default'
}

const tabButtonClass = (active: boolean) =>
  `border-b-2 px-3 py-2 text-sm ${active ? 'border-blue-500 font-semibold text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`

type TabKey = 'basic' | 'details' | 'unit'

export default function ConfigItems() {
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProjectId, setSelectedProjectId] = useState<number | 'all'>('all')
  const [items, setItems] = useState<ConfigItem[]>([])
  const [loading, setLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<TabKey>('basic')
  const [editingItem, setEditingItem] = useState<ConfigItem | null>(null)
  const [formData, setFormData] = useState<ConfigForm>(emptyForm)
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
      const response = await fetch(`/api/v1/config-items${query}`)
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

  const fillFormFromItem = (item: ConfigItem) => {
    setFormData({
      code: item.code ?? '',
      title: item.title ?? '',
      config_type: item.config_type ?? 'standard',
      status: item.status ?? 'planned',
      description: item.description ?? '',
      project_id: item.project_id ? String(item.project_id) : '',
      t_code: item.t_code ?? '',
      config_details: item.config_details ?? '',
      table_references: '',
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

  const openEditModal = async (item: ConfigItem) => {
    setEditingItem(item)
    setActiveTab('basic')
    setIsModalOpen(true)
    setDetailLoading(true)
    setConvertMessage('')
    try {
      const response = await fetch(`/api/v1/config-items/${item.id}`)
      if (!response.ok) {
        throw new Error('Failed to load')
      }
      const data = (await response.json()) as ConfigItem
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

  const handleChange = (field: keyof ConfigForm) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setFormData((prev) => ({ ...prev, [field]: event.target.value }))
    }

  const buildPayload = () => ({
    code: formData.code || undefined,
    title: formData.title,
    config_type: formData.config_type,
    status: formData.status,
    description: formData.description || undefined,
    project_id: formData.project_id ? Number(formData.project_id) : undefined,
    t_code: formData.t_code || undefined,
    config_details: formData.config_details || undefined,
    unit_test_steps: formData.unit_test_steps || undefined,
  })

  const handleSave = async () => {
    setSaving(true)
    try {
      const url = editingItem
        ? `/api/v1/config-items/${editingItem.id}`
        : '/api/v1/config-items'
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
      await fetch(`/api/v1/config-items/${editingItem.id}`, {
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
        `/api/v1/config-items/${editingItem.id}/convert-to-test`,
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
      render: (row: ConfigItem) => row.code ?? `#${row.id}`,
    },
    {
      key: 'title',
      label: 'Title',
      render: (row: ConfigItem) => (
        <span className="font-semibold text-gray-900">{row.title}</span>
      ),
    },
    {
      key: 'config_type',
      label: 'Config Type',
      render: (row: ConfigItem) => (
        <Badge
          text={row.config_type ?? 'standard'}
          variant={configVariant(row.config_type)}
        />
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (row: ConfigItem) => (
        <Badge text={row.status ?? 'planned'} variant={statusVariant(row.status)} />
      ),
    },
    { key: 't_code', label: 'T-Code' },
    {
      key: 'project',
      label: 'Project',
      render: (row: ConfigItem) => projectName(row.project_id),
    },
  ]

  const isEditing = Boolean(editingItem)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-semibold text-gray-900">Config Items</h1>
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
        <Button onClick={openNewModal}>New Config</Button>
      </div>

      <DataTable
        columns={columns}
        data={items}
        loading={loading}
        onRowClick={openEditModal}
        emptyMessage="No config items yet"
      />

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={isEditing ? 'Config Details' : 'New Config'}
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
                      className={tabButtonClass(activeTab === 'details')}
                      onClick={() => setActiveTab('details')}
                      type="button"
                    >
                      Config Details
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
                        <label className="text-sm font-medium text-gray-700">Config Type</label>
                        <select
                          className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                          onChange={handleChange('config_type')}
                          value={formData.config_type}
                        >
                          <option value="standard">Standard</option>
                          <option value="custom">Custom</option>
                          <option value="enhancement">Enhancement</option>
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
                      <Button onClick={handleSaveSection} loading={saving}>
                        Save
                      </Button>
                    </div>
                  </div>
                )}

                {activeTab === 'details' && (
                  <div className="mt-4 space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">T-Code</label>
                      <input
                        className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                        onChange={handleChange('t_code')}
                        value={formData.t_code}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Config Details</label>
                      <textarea
                        className="min-h-[200px] w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                        onChange={handleChange('config_details')}
                        value={formData.config_details}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Table References</label>
                      <textarea
                        className="min-h-[120px] w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                        onChange={handleChange('table_references')}
                        value={formData.table_references}
                      />
                    </div>
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
                    <label className="text-sm font-medium text-gray-700">Config Type</label>
                    <select
                      className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                      onChange={handleChange('config_type')}
                      value={formData.config_type}
                    >
                      <option value="standard">Standard</option>
                      <option value="custom">Custom</option>
                      <option value="enhancement">Enhancement</option>
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
