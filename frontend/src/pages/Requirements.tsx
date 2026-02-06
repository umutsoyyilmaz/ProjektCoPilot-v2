import { useEffect, useState, type ChangeEvent } from 'react'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import DataTable from '../components/ui/DataTable'
import Modal from '../components/ui/Modal'

interface Project {
  id: number
  project_name: string
}

interface Requirement {
  id: number
  code: string
  title: string
  description?: string
  classification?: string
  module?: string
  priority?: string
  status?: string
  conversion_status?: string
  conversion_type?: string
  conversion_id?: number
}

interface RequirementForm {
  code: string
  title: string
  description: string
  classification: string
  module: string
  priority: string
  status: string
}

const emptyForm: RequirementForm = {
  code: '',
  title: '',
  description: '',
  classification: 'Fit',
  module: '',
  priority: 'medium',
  status: 'open',
}

const classificationVariant = (classification?: string) => {
  if (classification === 'Fit') return 'success'
  if (classification === 'Partial Fit') return 'warning'
  if (classification === 'Gap') return 'danger'
  return 'default'
}

const priorityVariant = (priority?: string) => {
  if (priority === 'critical') return 'danger'
  if (priority === 'high') return 'danger'
  if (priority === 'medium') return 'warning'
  if (priority === 'low') return 'info'
  return 'default'
}

const statusVariant = (status?: string) => {
  if (status === 'open') return 'info'
  if (status === 'in_progress') return 'warning'
  if (status === 'closed') return 'success'
  return 'default'
}

export default function Requirements() {
  const [projects, setProjects] = useState<Project[]>([])
  const [requirements, setRequirements] = useState<Requirement[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedProjectId, setSelectedProjectId] = useState<number | 'all'>('all')
  const [selectedClassification, setSelectedClassification] = useState('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingRequirement, setEditingRequirement] = useState<Requirement | null>(null)
  const [formData, setFormData] = useState<RequirementForm>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [converting, setConverting] = useState(false)
  const [conversionMessage, setConversionMessage] = useState('')

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/v1/projects')
      const data = await response.json()
      setProjects(Array.isArray(data) ? data : [])
    } catch {
      setProjects([])
    }
  }

  const fetchRequirements = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (selectedProjectId !== 'all') {
        params.set('project_id', String(selectedProjectId))
      }
      if (selectedClassification !== 'all') {
        params.set('classification', selectedClassification)
      }
      const query = params.toString()
      const response = await fetch(`/api/v1/requirements${query ? `?${query}` : ''}`)
      const data = await response.json()
      setRequirements(Array.isArray(data) ? data : [])
    } catch {
      setRequirements([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  useEffect(() => {
    fetchRequirements()
  }, [selectedProjectId, selectedClassification])

  const openNewModal = () => {
    setEditingRequirement(null)
    setFormData(emptyForm)
    setConversionMessage('')
    setIsModalOpen(true)
  }

  const openEditModal = (requirement: Requirement) => {
    setEditingRequirement(requirement)
    setFormData({
      code: requirement.code ?? '',
      title: requirement.title ?? '',
      description: requirement.description ?? '',
      classification: requirement.classification ?? 'Fit',
      module: requirement.module ?? '',
      priority: requirement.priority ?? 'medium',
      status: requirement.status ?? 'open',
    })
    setConversionMessage('')
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingRequirement(null)
    setFormData(emptyForm)
    setConversionMessage('')
  }

  const handleChange = (field: keyof RequirementForm) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setFormData((prev) => ({ ...prev, [field]: event.target.value }))
    }

  const handleSave = async () => {
    setSaving(true)
    try {
      const url = editingRequirement
        ? `/api/v1/requirements/${editingRequirement.id}`
        : '/api/v1/requirements'
      const method = editingRequirement ? 'PUT' : 'POST'

      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      await fetchRequirements()
      closeModal()
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!editingRequirement) return
    setDeleting(true)
    try {
      await fetch(`/api/v1/requirements/${editingRequirement.id}`, { method: 'DELETE' })
      await fetchRequirements()
      closeModal()
    } finally {
      setDeleting(false)
    }
  }

  const handleConvert = async () => {
    if (!editingRequirement) return
    setConverting(true)
    setConversionMessage('')
    try {
      const response = await fetch(`/api/v1/requirements/${editingRequirement.id}/convert`, {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Conversion failed')
      }

      const data = await response.json()
      alert(`Converted to ${data.conversion_type}! Created item ID: ${data.created_item_id}`)
      setEditingRequirement((prev) => ({
        ...prev,
        ...data,
        conversion_status: 'converted',
      }))
      setConversionMessage('Converted successfully')
      await fetchRequirements()
    } catch {
      setConversionMessage('Conversion failed')
    } finally {
      setConverting(false)
    }
  }

  const columns = [
    { key: 'code', label: 'Code' },
    {
      key: 'title',
      label: 'Title',
      render: (row: Requirement) => (
        <span className="font-semibold text-gray-900">{row.title}</span>
      ),
    },
    {
      key: 'classification',
      label: 'Classification',
      render: (row: Requirement) => (
        <Badge
          text={row.classification ?? 'N/A'}
          variant={classificationVariant(row.classification)}
        />
      ),
    },
    { key: 'module', label: 'Module' },
    {
      key: 'priority',
      label: 'Priority',
      render: (row: Requirement) => (
        <Badge text={row.priority ?? 'medium'} variant={priorityVariant(row.priority)} />
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (row: Requirement) => (
        <Badge text={row.status ?? 'open'} variant={statusVariant(row.status)} />
      ),
    },
    {
      key: 'conversion_status',
      label: 'Conversion',
      render: (row: Requirement) =>
        row.conversion_status === 'converted' ? (
          <Badge text="Converted" variant="success" />
        ) : (
          '—'
        ),
    },
  ]

  const isConverted = editingRequirement?.conversion_status === 'converted'
  const canConvert =
    !isConverted &&
    ['Fit', 'Gap', 'Partial Fit'].includes(editingRequirement?.classification ?? '')

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-semibold text-gray-900">Requirements</h1>
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
          <select
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
            onChange={(event) => setSelectedClassification(event.target.value)}
            value={selectedClassification}
          >
            <option value="all">All</option>
            <option value="Fit">Fit</option>
            <option value="Partial Fit">Partial Fit</option>
            <option value="Gap">Gap</option>
          </select>
        </div>
        <Button onClick={openNewModal}>New Requirement</Button>
      </div>

      <DataTable
        columns={columns}
        data={requirements}
        loading={loading}
        onRowClick={openEditModal}
        emptyMessage="No requirements yet"
      />

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingRequirement ? 'Requirement Details' : 'New Requirement'}
        size="xl"
      >
        <div className="space-y-4">
          {editingRequirement && (
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-lg font-semibold text-gray-900">
                {editingRequirement.title}
              </h2>
              <Badge
                text={editingRequirement.classification ?? 'N/A'}
                variant={classificationVariant(editingRequirement.classification)}
              />
            </div>
          )}
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-gray-700">Code</label>
              <input
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                onChange={handleChange('code')}
                value={formData.code}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Title</label>
              <input
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                onChange={handleChange('title')}
                value={formData.title}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Classification</label>
              <select
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                onChange={handleChange('classification')}
                value={formData.classification}
              >
                <option value="Fit">Fit</option>
                <option value="Partial Fit">Partial Fit</option>
                <option value="Gap">Gap</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Module</label>
              <input
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                onChange={handleChange('module')}
                value={formData.module}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Priority</label>
              <select
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                onChange={handleChange('priority')}
                value={formData.priority}
              >
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Status</label>
              <select
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                onChange={handleChange('status')}
                value={formData.status}
              >
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="closed">Closed</option>
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

          {editingRequirement && (
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="text-sm font-medium text-gray-700">Conversion</div>
                {isConverted ? (
                  <Badge
                    text={`✅ Converted to ${editingRequirement.conversion_type ?? 'item'}`}
                    variant="success"
                  />
                ) : (
                  <Button
                    size="sm"
                    onClick={handleConvert}
                    disabled={!canConvert}
                    loading={converting}
                  >
                    Convert
                  </Button>
                )}
              </div>
              {conversionMessage && (
                <div className="mt-2 text-sm text-gray-600">{conversionMessage}</div>
              )}
            </div>
          )}

          <div className="flex items-center justify-between">
            {editingRequirement ? (
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
