import { useEffect, useState, type ChangeEvent } from 'react'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import DataTable from '../components/ui/DataTable'
import Modal from '../components/ui/Modal'

interface Project {
  id: number
  project_code: string
  project_name: string
  customer_name?: string
  customer_industry?: string
  description?: string
  status?: string
  start_date?: string
  end_date?: string
  project_manager?: string
  solution_architect?: string
}

interface ProjectForm {
  project_code: string
  project_name: string
  customer_name: string
  customer_industry: string
  description: string
  status: string
  start_date: string
  end_date: string
  project_manager: string
  solution_architect: string
}

const emptyForm: ProjectForm = {
  project_code: '',
  project_name: '',
  customer_name: '',
  customer_industry: '',
  description: '',
  status: 'planning',
  start_date: '',
  end_date: '',
  project_manager: '',
  solution_architect: '',
}

const statusVariant = (status?: string) => {
  if (status === 'active') return 'success'
  if (status === 'planning') return 'info'
  if (status === 'completed') return 'default'
  if (status === 'on_hold') return 'warning'
  return 'default'
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [formData, setFormData] = useState<ProjectForm>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const fetchProjects = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/v1/projects')
      const data = await response.json()
      setProjects(Array.isArray(data) ? data : [])
    } catch {
      setProjects([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  const openNewModal = () => {
    setEditingProject(null)
    setFormData(emptyForm)
    setIsModalOpen(true)
  }

  const openEditModal = (project: Project) => {
    setEditingProject(project)
    setFormData({
      project_code: project.project_code ?? '',
      project_name: project.project_name ?? '',
      customer_name: project.customer_name ?? '',
      customer_industry: project.customer_industry ?? '',
      description: project.description ?? '',
      status: project.status ?? 'planning',
      start_date: project.start_date ?? '',
      end_date: project.end_date ?? '',
      project_manager: project.project_manager ?? '',
      solution_architect: project.solution_architect ?? '',
    })
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingProject(null)
    setFormData(emptyForm)
  }

  const handleChange = (field: keyof ProjectForm) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setFormData((prev) => ({ ...prev, [field]: event.target.value }))
    }

  const handleSave = async () => {
    setSaving(true)
    try {
      const url = editingProject
        ? `/api/v1/projects/${editingProject.id}`
        : '/api/v1/projects'
      const method = editingProject ? 'PUT' : 'POST'

      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      await fetchProjects()
      closeModal()
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!editingProject) return
    setDeleting(true)
    try {
      await fetch(`/api/v1/projects/${editingProject.id}`, { method: 'DELETE' })
      await fetchProjects()
      closeModal()
    } finally {
      setDeleting(false)
    }
  }

  const columns = [
    { key: 'project_code', label: 'Code' },
    {
      key: 'project_name',
      label: 'Name',
      render: (row: Project) => (
        <span className="font-semibold text-gray-900">{row.project_name}</span>
      ),
    },
    { key: 'customer_name', label: 'Customer' },
    { key: 'customer_industry', label: 'Industry' },
    {
      key: 'status',
      label: 'Status',
      render: (row: Project) => (
        <Badge text={row.status ?? 'planning'} variant={statusVariant(row.status)} />
      ),
    },
    { key: 'project_manager', label: 'PM' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-gray-900">Projects</h1>
        <Button onClick={openNewModal}>New Project</Button>
      </div>

      <DataTable
        columns={columns}
        data={projects}
        loading={loading}
        onRowClick={openEditModal}
        emptyMessage="No projects yet"
      />

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingProject ? 'Edit Project' : 'New Project'}
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-gray-700">Project Code</label>
              <input
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                onChange={handleChange('project_code')}
                value={formData.project_code}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Project Name</label>
              <input
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                onChange={handleChange('project_name')}
                value={formData.project_name}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Customer</label>
              <input
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                onChange={handleChange('customer_name')}
                value={formData.customer_name}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Industry</label>
              <input
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                onChange={handleChange('customer_industry')}
                value={formData.customer_industry}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Status</label>
              <select
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                onChange={handleChange('status')}
                value={formData.status}
              >
                <option value="planning">Planning</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="on_hold">On Hold</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Project Manager</label>
              <input
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                onChange={handleChange('project_manager')}
                value={formData.project_manager}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Start Date</label>
              <input
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                onChange={handleChange('start_date')}
                type="date"
                value={formData.start_date}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">End Date</label>
              <input
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                onChange={handleChange('end_date')}
                type="date"
                value={formData.end_date}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Solution Architect</label>
              <input
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                onChange={handleChange('solution_architect')}
                value={formData.solution_architect}
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
          <div className="flex items-center justify-between">
            {editingProject ? (
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
