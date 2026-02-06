import { useEffect, useMemo, useState, type ChangeEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import DataTable from '../components/ui/DataTable'
import Modal from '../components/ui/Modal'

interface Project {
  id: number
  project_name: string
}

interface TestCase {
  id: number
  code?: string
  title: string
  test_type?: string
  status?: string
  priority?: string
  source_type?: string
  description?: string
  steps?: string
  expected_result?: string
  project_id?: number
}

interface TestForm {
  title: string
  test_type: string
  status: string
  priority: string
  description: string
  steps: string
  expected_result: string
}

const emptyForm: TestForm = {
  title: '',
  test_type: 'unit',
  status: 'not_started',
  priority: 'medium',
  description: '',
  steps: '',
  expected_result: '',
}

const testTypes = [
  { label: 'Unit', value: 'unit' },
  { label: 'SIT', value: 'sit' },
  { label: 'UAT', value: 'uat' },
  { label: 'String', value: 'string' },
  { label: 'Sprint', value: 'sprint' },
  { label: 'Performance', value: 'performance' },
  { label: 'Regression', value: 'regression' },
]

const statusVariant = (status?: string) => {
  if (status === 'not_started') return 'default'
  if (status === 'in_progress') return 'warning'
  if (status === 'passed') return 'success'
  if (status === 'failed') return 'danger'
  if (status === 'blocked') return 'default'
  return 'default'
}

const priorityVariant = (priority?: string) => {
  if (priority === 'high') return 'danger'
  if (priority === 'medium') return 'warning'
  if (priority === 'low') return 'info'
  return 'default'
}

const tabButtonClass = (active: boolean) =>
  `border-b-2 px-3 py-2 text-sm ${active ? 'border-blue-500 font-semibold text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`

export default function TestManagement() {
  const navigate = useNavigate()
  const { type } = useParams()
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProjectId, setSelectedProjectId] = useState<number | 'all'>('all')
  const [tests, setTests] = useState<TestCase[]>([])
  const [loading, setLoading] = useState(false)
  const [activeType, setActiveType] = useState('unit')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTest, setEditingTest] = useState<TestCase | null>(null)
  const [formData, setFormData] = useState<TestForm>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/v1/projects')
      const data = await response.json()
      setProjects(Array.isArray(data) ? data : [])
    } catch {
      setProjects([])
    }
  }

  const fetchTests = async (testType: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/v1/tests?test_type=${testType}`)
      const data = await response.json()
      setTests(Array.isArray(data) ? data : [])
    } catch {
      setTests([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  useEffect(() => {
    const match = testTypes.find((item) => item.value === type)
    if (match) {
      setActiveType(match.value)
    }
  }, [type])

  useEffect(() => {
    fetchTests(activeType)
  }, [activeType])

  const filteredTests = useMemo(() => {
    if (selectedProjectId === 'all') return tests
    return tests.filter((test) => test.project_id === selectedProjectId)
  }, [tests, selectedProjectId])

  const openEditModal = (testCase: TestCase) => {
    setEditingTest(testCase)
    setFormData({
      title: testCase.title ?? '',
      test_type: testCase.test_type ?? activeType,
      status: testCase.status ?? 'not_started',
      priority: testCase.priority ?? 'medium',
      description: testCase.description ?? '',
      steps: testCase.steps ?? '',
      expected_result: testCase.expected_result ?? '',
    })
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingTest(null)
    setFormData(emptyForm)
  }

  const handleChange = (field: keyof TestForm) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setFormData((prev) => ({ ...prev, [field]: event.target.value }))
    }

  const handleSave = async () => {
    if (!editingTest) return
    setSaving(true)
    try {
      await fetch(`/api/v1/tests/${editingTest.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      await fetchTests(activeType)
      closeModal()
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!editingTest) return
    setDeleting(true)
    try {
      await fetch(`/api/v1/tests/${editingTest.id}`, { method: 'DELETE' })
      await fetchTests(activeType)
      closeModal()
    } finally {
      setDeleting(false)
    }
  }

  const columns = [
    { key: 'code', label: 'Code' },
    {
      key: 'title',
      label: 'Title',
      render: (row: TestCase) => (
        <span className="font-semibold text-gray-900">{row.title}</span>
      ),
    },
    {
      key: 'test_type',
      label: 'Test Type',
      render: (row: TestCase) => (
        <Badge text={row.test_type ?? activeType} variant="info" />
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (row: TestCase) => (
        <Badge text={row.status ?? 'not_started'} variant={statusVariant(row.status)} />
      ),
    },
    { key: 'source_type', label: 'Source Type' },
    {
      key: 'priority',
      label: 'Priority',
      render: (row: TestCase) => (
        <Badge text={row.priority ?? 'medium'} variant={priorityVariant(row.priority)} />
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Test Management</h1>
          <div className="mt-3 flex flex-wrap gap-4 border-b border-gray-200">
            {testTypes.map((item) => (
              <button
                key={item.value}
                className={tabButtonClass(activeType === item.value)}
                onClick={() => {
                  setActiveType(item.value)
                  navigate(`/tests/${item.value}`)
                }}
                type="button"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
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

      <DataTable
        columns={columns}
        data={filteredTests}
        loading={loading}
        onRowClick={openEditModal}
        emptyMessage="No tests yet"
      />

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title="Edit Test Case"
        size="lg"
      >
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
              <label className="text-sm font-medium text-gray-700">Test Type</label>
              <select
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                onChange={handleChange('test_type')}
                value={formData.test_type}
              >
                {testTypes.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
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
                <option value="not_started">Not Started</option>
                <option value="in_progress">In Progress</option>
                <option value="passed">Passed</option>
                <option value="failed">Failed</option>
                <option value="blocked">Blocked</option>
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
          <div>
            <label className="text-sm font-medium text-gray-700">Steps</label>
            <textarea
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
              onChange={handleChange('steps')}
              rows={3}
              value={formData.steps}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Expected Result</label>
            <textarea
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
              onChange={handleChange('expected_result')}
              rows={3}
              value={formData.expected_result}
            />
          </div>
          <div className="flex items-center justify-between">
            <Button variant="danger" onClick={handleDelete} loading={deleting}>
              Delete
            </Button>
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
