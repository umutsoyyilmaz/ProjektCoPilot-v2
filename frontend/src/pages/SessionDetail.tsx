import { useEffect, useState, type ChangeEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import DataTable from '../components/ui/DataTable'
import Modal from '../components/ui/Modal'

interface SessionDetail {
  id: number
  session_name: string
  session_code?: string
  module?: string
  facilitator?: string
  status?: string
}

interface QuestionItem {
  id: number
  question_id?: string
  question_text?: string
  answer_text?: string
  status?: string
  assigned_to?: string
  category?: string
}

interface FitGapItem {
  id: number
  gap_id?: string
  gap_description?: string
  solution_type?: string
  priority?: string
  fit_gap_status?: string
}

interface DecisionItem {
  id: number
  decision_id?: string
  title?: string
  description?: string
  impact?: string
  decided_by?: string
  decision_date?: string
}

interface RiskItem {
  id: number
  item_id?: string
  type?: string
  description?: string
  probability?: string
  impact?: string
  risk_score?: number
  owner?: string
  mitigation_plan?: string
  status?: string
}

interface ActionItem {
  id: number
  action_id?: string
  title?: string
  description?: string
  assigned_to?: string
  due_date?: string
  status?: string
}

interface AttendeeItem {
  id: number
  name?: string
  role?: string
  email?: string
  department?: string
}

interface AgendaItem {
  id: number
  topic?: string
  duration?: string
  presenter?: string
  notes?: string
}

interface QuestionForm {
  question_text: string
  answer_text: string
  status: string
  asked_by: string
  assigned_to: string
}

interface FitGapForm {
  gap_id: string
  gap_description: string
  solution_type: string
  priority: string
  status: string
}

interface DecisionForm {
  decision_id: string
  title: string
  description: string
  impact: string
  decided_by: string
  decision_date: string
}

interface RiskForm {
  item_id: string
  type: string
  description: string
  probability: string
  impact: string
  owner: string
  mitigation: string
  status: string
}

interface ActionForm {
  action_id: string
  title: string
  description: string
  assigned_to: string
  due_date: string
  status: string
}

interface AttendeeForm {
  name: string
  role: string
  email: string
  department: string
}

interface AgendaForm {
  topic: string
  duration: string
  presenter: string
  notes: string
}

const emptyQuestionForm: QuestionForm = {
  question_text: '',
  answer_text: '',
  status: 'open',
  asked_by: '',
  assigned_to: '',
}

const emptyFitGapForm: FitGapForm = {
  gap_id: '',
  gap_description: '',
  solution_type: 'standard',
  priority: 'medium',
  status: 'open',
}

const emptyDecisionForm: DecisionForm = {
  decision_id: '',
  title: '',
  description: '',
  impact: 'medium',
  decided_by: '',
  decision_date: '',
}

const emptyRiskForm: RiskForm = {
  item_id: '',
  type: 'risk',
  description: '',
  probability: '1',
  impact: '1',
  owner: '',
  mitigation: '',
  status: 'open',
}

const emptyActionForm: ActionForm = {
  action_id: '',
  title: '',
  description: '',
  assigned_to: '',
  due_date: '',
  status: 'open',
}

const emptyAttendeeForm: AttendeeForm = {
  name: '',
  role: '',
  email: '',
  department: '',
}

const emptyAgendaForm: AgendaForm = {
  topic: '',
  duration: '',
  presenter: '',
  notes: '',
}

const sessionStatusVariant = (status?: string) => {
  if (status === 'completed') return 'success'
  if (status === 'in_progress') return 'warning'
  if (status === 'planned') return 'default'
  return 'default'
}

const questionStatusVariant = (status?: string) => {
  if (status === 'answered') return 'success'
  if (status === 'deferred') return 'warning'
  return 'default'
}

const decisionImpactVariant = (impact?: string) => {
  if (impact === 'high') return 'danger'
  if (impact === 'medium') return 'warning'
  if (impact === 'low') return 'info'
  return 'default'
}

const actionStatusVariant = (status?: string) => {
  if (status === 'completed') return 'success'
  if (status === 'overdue') return 'danger'
  if (status === 'in_progress') return 'warning'
  return 'default'
}

const riskScoreVariant = (score?: number) => {
  if (!score) return 'default'
  if (score >= 13) return 'danger'
  if (score >= 6) return 'warning'
  return 'success'
}

const tabs = [
  { key: 'questions', label: 'Questions' },
  { key: 'fitgap', label: 'Fit-Gap' },
  { key: 'decisions', label: 'Decisions' },
  { key: 'risks', label: 'Risks' },
  { key: 'actions', label: 'Actions' },
  { key: 'attendees', label: 'Attendees' },
  { key: 'agenda', label: 'Agenda' },
]

export default function SessionDetail() {
  const navigate = useNavigate()
  const { id } = useParams()
  const sessionId = Number(id)

  const [session, setSession] = useState<SessionDetail | null>(null)
  const [sessionLoading, setSessionLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('questions')

  const [questions, setQuestions] = useState<QuestionItem[]>([])
  const [questionsLoading, setQuestionsLoading] = useState(false)
  const [questionsLoaded, setQuestionsLoaded] = useState(false)
  const [questionModalOpen, setQuestionModalOpen] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<QuestionItem | null>(null)
  const [questionForm, setQuestionForm] = useState<QuestionForm>(emptyQuestionForm)
  const [questionSaving, setQuestionSaving] = useState(false)

  const [fitGaps, setFitGaps] = useState<FitGapItem[]>([])
  const [fitGapLoading, setFitGapLoading] = useState(false)
  const [fitGapLoaded, setFitGapLoaded] = useState(false)
  const [fitGapModalOpen, setFitGapModalOpen] = useState(false)
  const [editingFitGap, setEditingFitGap] = useState<FitGapItem | null>(null)
  const [fitGapForm, setFitGapForm] = useState<FitGapForm>(emptyFitGapForm)
  const [fitGapSaving, setFitGapSaving] = useState(false)

  const [decisions, setDecisions] = useState<DecisionItem[]>([])
  const [decisionsLoading, setDecisionsLoading] = useState(false)
  const [decisionsLoaded, setDecisionsLoaded] = useState(false)
  const [decisionModalOpen, setDecisionModalOpen] = useState(false)
  const [editingDecision, setEditingDecision] = useState<DecisionItem | null>(null)
  const [decisionForm, setDecisionForm] = useState<DecisionForm>(emptyDecisionForm)
  const [decisionSaving, setDecisionSaving] = useState(false)

  const [risks, setRisks] = useState<RiskItem[]>([])
  const [risksLoading, setRisksLoading] = useState(false)
  const [risksLoaded, setRisksLoaded] = useState(false)
  const [riskModalOpen, setRiskModalOpen] = useState(false)
  const [editingRisk, setEditingRisk] = useState<RiskItem | null>(null)
  const [riskForm, setRiskForm] = useState<RiskForm>(emptyRiskForm)
  const [riskSaving, setRiskSaving] = useState(false)

  const [actions, setActions] = useState<ActionItem[]>([])
  const [actionsLoading, setActionsLoading] = useState(false)
  const [actionsLoaded, setActionsLoaded] = useState(false)
  const [actionModalOpen, setActionModalOpen] = useState(false)
  const [editingAction, setEditingAction] = useState<ActionItem | null>(null)
  const [actionForm, setActionForm] = useState<ActionForm>(emptyActionForm)
  const [actionSaving, setActionSaving] = useState(false)

  const [attendees, setAttendees] = useState<AttendeeItem[]>([])
  const [attendeesLoading, setAttendeesLoading] = useState(false)
  const [attendeesLoaded, setAttendeesLoaded] = useState(false)
  const [attendeeModalOpen, setAttendeeModalOpen] = useState(false)
  const [editingAttendee, setEditingAttendee] = useState<AttendeeItem | null>(null)
  const [attendeeForm, setAttendeeForm] = useState<AttendeeForm>(emptyAttendeeForm)
  const [attendeeSaving, setAttendeeSaving] = useState(false)

  const [agendaItems, setAgendaItems] = useState<AgendaItem[]>([])
  const [agendaLoading, setAgendaLoading] = useState(false)
  const [agendaLoaded, setAgendaLoaded] = useState(false)
  const [agendaModalOpen, setAgendaModalOpen] = useState(false)
  const [editingAgenda, setEditingAgenda] = useState<AgendaItem | null>(null)
  const [agendaForm, setAgendaForm] = useState<AgendaForm>(emptyAgendaForm)
  const [agendaSaving, setAgendaSaving] = useState(false)

  const fetchSession = async () => {
    if (!sessionId || Number.isNaN(sessionId)) return
    setSessionLoading(true)
    try {
      const response = await fetch(`/api/v1/sessions/${sessionId}`)
      const data = await response.json()
      setSession(data ?? null)
    } catch {
      setSession(null)
    } finally {
      setSessionLoading(false)
    }
  }

  const fetchQuestions = async () => {
    if (!sessionId || Number.isNaN(sessionId)) return
    setQuestionsLoading(true)
    try {
      const response = await fetch(`/api/v1/sessions/${sessionId}/questions`)
      const data = await response.json()
      setQuestions(Array.isArray(data) ? data : [])
      setQuestionsLoaded(true)
    } catch {
      setQuestions([])
    } finally {
      setQuestionsLoading(false)
    }
  }

  const fetchFitGaps = async () => {
    if (!sessionId || Number.isNaN(sessionId)) return
    setFitGapLoading(true)
    try {
      const response = await fetch(`/api/v1/sessions/${sessionId}/fitgap`)
      const data = await response.json()
      setFitGaps(Array.isArray(data) ? data : [])
      setFitGapLoaded(true)
    } catch {
      setFitGaps([])
    } finally {
      setFitGapLoading(false)
    }
  }

  const fetchDecisions = async () => {
    if (!sessionId || Number.isNaN(sessionId)) return
    setDecisionsLoading(true)
    try {
      const response = await fetch(`/api/v1/sessions/${sessionId}/decisions`)
      const data = await response.json()
      setDecisions(Array.isArray(data) ? data : [])
      setDecisionsLoaded(true)
    } catch {
      setDecisions([])
    } finally {
      setDecisionsLoading(false)
    }
  }

  const fetchRisks = async () => {
    if (!sessionId || Number.isNaN(sessionId)) return
    setRisksLoading(true)
    try {
      const response = await fetch(`/api/v1/sessions/${sessionId}/risks`)
      const data = await response.json()
      setRisks(Array.isArray(data) ? data : [])
      setRisksLoaded(true)
    } catch {
      setRisks([])
    } finally {
      setRisksLoading(false)
    }
  }

  const fetchActions = async () => {
    if (!sessionId || Number.isNaN(sessionId)) return
    setActionsLoading(true)
    try {
      const response = await fetch(`/api/v1/sessions/${sessionId}/actions`)
      const data = await response.json()
      setActions(Array.isArray(data) ? data : [])
      setActionsLoaded(true)
    } catch {
      setActions([])
    } finally {
      setActionsLoading(false)
    }
  }

  const fetchAttendees = async () => {
    if (!sessionId || Number.isNaN(sessionId)) return
    setAttendeesLoading(true)
    try {
      const response = await fetch(`/api/v1/sessions/${sessionId}/attendees`)
      const data = await response.json()
      setAttendees(Array.isArray(data) ? data : [])
      setAttendeesLoaded(true)
    } catch {
      setAttendees([])
    } finally {
      setAttendeesLoading(false)
    }
  }

  const fetchAgenda = async () => {
    if (!sessionId || Number.isNaN(sessionId)) return
    setAgendaLoading(true)
    try {
      const response = await fetch(`/api/v1/sessions/${sessionId}/agenda`)
      const data = await response.json()
      setAgendaItems(Array.isArray(data) ? data : [])
      setAgendaLoaded(true)
    } catch {
      setAgendaItems([])
    } finally {
      setAgendaLoading(false)
    }
  }

  useEffect(() => {
    fetchSession()
  }, [sessionId])
  
  useEffect(() => {
    setQuestions([])
    setQuestionsLoaded(false)
    setFitGaps([])
    setFitGapLoaded(false)
    setDecisions([])
    setDecisionsLoaded(false)
    setRisks([])
    setRisksLoaded(false)
    setActions([])
    setActionsLoaded(false)
    setAttendees([])
    setAttendeesLoaded(false)
    setAgendaItems([])
    setAgendaLoaded(false)
  }, [sessionId])

  useEffect(() => {
    if (activeTab === 'questions' && !questionsLoaded) {
      fetchQuestions()
    }
    if (activeTab === 'fitgap' && !fitGapLoaded) {
      fetchFitGaps()
    }
    if (activeTab === 'decisions' && !decisionsLoaded) {
      fetchDecisions()
    }
    if (activeTab === 'risks' && !risksLoaded) {
      fetchRisks()
    }
    if (activeTab === 'actions' && !actionsLoaded) {
      fetchActions()
    }
    if (activeTab === 'attendees' && !attendeesLoaded) {
      fetchAttendees()
    }
    if (activeTab === 'agenda' && !agendaLoaded) {
      fetchAgenda()
    }
  }, [
    activeTab,
    agendaLoaded,
    attendeesLoaded,
    actionsLoaded,
    decisionsLoaded,
    fitGapLoaded,
    questionsLoaded,
    risksLoaded,
  ])

  const handleQuestionChange = (field: keyof QuestionForm) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setQuestionForm((prev) => ({ ...prev, [field]: event.target.value }))
    }

  const handleFitGapChange = (field: keyof FitGapForm) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setFitGapForm((prev) => ({ ...prev, [field]: event.target.value }))
    }

  const handleDecisionChange = (field: keyof DecisionForm) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setDecisionForm((prev) => ({ ...prev, [field]: event.target.value }))
    }

  const handleRiskChange = (field: keyof RiskForm) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setRiskForm((prev) => ({ ...prev, [field]: event.target.value }))
    }

  const handleActionChange = (field: keyof ActionForm) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setActionForm((prev) => ({ ...prev, [field]: event.target.value }))
    }

  const handleAttendeeChange = (field: keyof AttendeeForm) =>
    (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setAttendeeForm((prev) => ({ ...prev, [field]: event.target.value }))
    }

  const handleAgendaChange = (field: keyof AgendaForm) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setAgendaForm((prev) => ({ ...prev, [field]: event.target.value }))
    }

  const openQuestionModal = () => {
    setEditingQuestion(null)
    setQuestionForm(emptyQuestionForm)
    setQuestionModalOpen(true)
  }

  const openQuestionEdit = (item: QuestionItem) => {
    setEditingQuestion(item)
    setQuestionForm({
      question_text: item.question_text ?? '',
      answer_text: item.answer_text ?? '',
      status: item.status ?? 'open',
      asked_by: item.category ?? '',
      assigned_to: item.assigned_to ?? '',
    })
    setQuestionModalOpen(true)
  }

  const closeQuestionModal = () => {
    setQuestionModalOpen(false)
    setEditingQuestion(null)
    setQuestionForm(emptyQuestionForm)
  }

  const saveQuestion = async () => {
    if (!sessionId || Number.isNaN(sessionId)) return
    setQuestionSaving(true)
    try {
      const url = editingQuestion
        ? `/api/v1/questions/${editingQuestion.id}`
        : `/api/v1/sessions/${sessionId}/questions`
      const method = editingQuestion ? 'PUT' : 'POST'

      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question_text: questionForm.question_text,
          answer_text: questionForm.answer_text,
          status: questionForm.status,
          assigned_to: questionForm.assigned_to,
          category: questionForm.asked_by,
        }),
      })

      await fetchQuestions()
      closeQuestionModal()
    } finally {
      setQuestionSaving(false)
    }
  }

  const openFitGapModal = () => {
    setEditingFitGap(null)
    setFitGapForm(emptyFitGapForm)
    setFitGapModalOpen(true)
  }

  const openFitGapEdit = (item: FitGapItem) => {
    setEditingFitGap(item)
    setFitGapForm({
      gap_id: item.gap_id ?? '',
      gap_description: item.gap_description ?? '',
      solution_type: item.solution_type ?? 'standard',
      priority: item.priority ?? 'medium',
      status: item.fit_gap_status ?? 'open',
    })
    setFitGapModalOpen(true)
  }

  const closeFitGapModal = () => {
    setFitGapModalOpen(false)
    setEditingFitGap(null)
    setFitGapForm(emptyFitGapForm)
  }

  const saveFitGap = async () => {
    if (!sessionId || Number.isNaN(sessionId)) return
    setFitGapSaving(true)
    try {
      const url = editingFitGap
        ? `/api/v1/fitgap/${editingFitGap.id}`
        : `/api/v1/sessions/${sessionId}/fitgap`
      const method = editingFitGap ? 'PUT' : 'POST'

      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gap_id: fitGapForm.gap_id,
          gap_description: fitGapForm.gap_description,
          solution_type: fitGapForm.solution_type,
          priority: fitGapForm.priority,
          fit_gap_status: fitGapForm.status,
        }),
      })

      await fetchFitGaps()
      closeFitGapModal()
    } finally {
      setFitGapSaving(false)
    }
  }

  const openDecisionModal = () => {
    setEditingDecision(null)
    setDecisionForm(emptyDecisionForm)
    setDecisionModalOpen(true)
  }

  const openDecisionEdit = (item: DecisionItem) => {
    setEditingDecision(item)
    setDecisionForm({
      decision_id: item.decision_id ?? '',
      title: item.title ?? '',
      description: item.description ?? '',
      impact: item.impact ?? 'medium',
      decided_by: item.decided_by ?? '',
      decision_date: item.decision_date ?? '',
    })
    setDecisionModalOpen(true)
  }

  const closeDecisionModal = () => {
    setDecisionModalOpen(false)
    setEditingDecision(null)
    setDecisionForm(emptyDecisionForm)
  }

  const saveDecision = async () => {
    if (!sessionId || Number.isNaN(sessionId)) return
    setDecisionSaving(true)
    try {
      const url = editingDecision
        ? `/api/v1/decisions/${editingDecision.id}`
        : `/api/v1/sessions/${sessionId}/decisions`
      const method = editingDecision ? 'PUT' : 'POST'

      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          decision_id: decisionForm.decision_id,
          title: decisionForm.title,
          description: decisionForm.description,
          impact: decisionForm.impact,
          decided_by: decisionForm.decided_by,
          decision_date: decisionForm.decision_date,
        }),
      })

      await fetchDecisions()
      closeDecisionModal()
    } finally {
      setDecisionSaving(false)
    }
  }

  const openRiskModal = () => {
    setEditingRisk(null)
    setRiskForm(emptyRiskForm)
    setRiskModalOpen(true)
  }

  const openRiskEdit = (item: RiskItem) => {
    setEditingRisk(item)
    setRiskForm({
      item_id: item.item_id ?? '',
      type: item.type ?? 'risk',
      description: item.description ?? '',
      probability: item.probability ?? '1',
      impact: item.impact ?? '1',
      owner: item.owner ?? '',
      mitigation: item.mitigation_plan ?? '',
      status: item.status ?? 'open',
    })
    setRiskModalOpen(true)
  }

  const closeRiskModal = () => {
    setRiskModalOpen(false)
    setEditingRisk(null)
    setRiskForm(emptyRiskForm)
  }

  const saveRisk = async () => {
    if (!sessionId || Number.isNaN(sessionId)) return
    setRiskSaving(true)
    try {
      const probabilityValue = Number(riskForm.probability)
      const impactValue = Number(riskForm.impact)
      const riskScore =
        Number.isNaN(probabilityValue) || Number.isNaN(impactValue)
          ? undefined
          : probabilityValue * impactValue

      const url = editingRisk
        ? `/api/v1/risks/${editingRisk.id}`
        : `/api/v1/sessions/${sessionId}/risks`
      const method = editingRisk ? 'PUT' : 'POST'

      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          item_id: riskForm.item_id,
          type: riskForm.type,
          description: riskForm.description,
          probability: riskForm.probability,
          impact: riskForm.impact,
          risk_score: riskScore,
          owner: riskForm.owner,
          mitigation_plan: riskForm.mitigation,
          status: riskForm.status,
        }),
      })

      await fetchRisks()
      closeRiskModal()
    } finally {
      setRiskSaving(false)
    }
  }

  const openActionModal = () => {
    setEditingAction(null)
    setActionForm(emptyActionForm)
    setActionModalOpen(true)
  }

  const openActionEdit = (item: ActionItem) => {
    setEditingAction(item)
    setActionForm({
      action_id: item.action_id ?? '',
      title: item.title ?? '',
      description: item.description ?? '',
      assigned_to: item.assigned_to ?? '',
      due_date: item.due_date ?? '',
      status: item.status ?? 'open',
    })
    setActionModalOpen(true)
  }

  const closeActionModal = () => {
    setActionModalOpen(false)
    setEditingAction(null)
    setActionForm(emptyActionForm)
  }

  const saveAction = async () => {
    if (!sessionId || Number.isNaN(sessionId)) return
    setActionSaving(true)
    try {
      const url = editingAction
        ? `/api/v1/actions/${editingAction.id}`
        : `/api/v1/sessions/${sessionId}/actions`
      const method = editingAction ? 'PUT' : 'POST'

      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action_id: actionForm.action_id,
          title: actionForm.title,
          description: actionForm.description,
          assigned_to: actionForm.assigned_to,
          due_date: actionForm.due_date,
          status: actionForm.status,
        }),
      })

      await fetchActions()
      closeActionModal()
    } finally {
      setActionSaving(false)
    }
  }

  const openAttendeeModal = () => {
    setEditingAttendee(null)
    setAttendeeForm(emptyAttendeeForm)
    setAttendeeModalOpen(true)
  }

  const openAttendeeEdit = (item: AttendeeItem) => {
    setEditingAttendee(item)
    setAttendeeForm({
      name: item.name ?? '',
      role: item.role ?? '',
      email: item.email ?? '',
      department: item.department ?? '',
    })
    setAttendeeModalOpen(true)
  }

  const closeAttendeeModal = () => {
    setAttendeeModalOpen(false)
    setEditingAttendee(null)
    setAttendeeForm(emptyAttendeeForm)
  }

  const saveAttendee = async () => {
    if (!sessionId || Number.isNaN(sessionId)) return
    setAttendeeSaving(true)
    try {
      const url = editingAttendee
        ? `/api/v1/attendees/${editingAttendee.id}`
        : `/api/v1/sessions/${sessionId}/attendees`
      const method = editingAttendee ? 'PUT' : 'POST'

      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: attendeeForm.name,
          role: attendeeForm.role,
          email: attendeeForm.email,
          department: attendeeForm.department,
        }),
      })

      await fetchAttendees()
      closeAttendeeModal()
    } finally {
      setAttendeeSaving(false)
    }
  }

  const openAgendaModal = () => {
    setEditingAgenda(null)
    setAgendaForm(emptyAgendaForm)
    setAgendaModalOpen(true)
  }

  const openAgendaEdit = (item: AgendaItem) => {
    setEditingAgenda(item)
    setAgendaForm({
      topic: item.topic ?? '',
      duration: item.duration ?? '',
      presenter: item.presenter ?? '',
      notes: item.notes ?? '',
    })
    setAgendaModalOpen(true)
  }

  const closeAgendaModal = () => {
    setAgendaModalOpen(false)
    setEditingAgenda(null)
    setAgendaForm(emptyAgendaForm)
  }

  const saveAgenda = async () => {
    if (!sessionId || Number.isNaN(sessionId)) return
    setAgendaSaving(true)
    try {
      const url = editingAgenda
        ? `/api/v1/agenda/${editingAgenda.id}`
        : `/api/v1/sessions/${sessionId}/agenda`
      const method = editingAgenda ? 'PUT' : 'POST'

      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: agendaForm.topic,
          duration: agendaForm.duration,
          presenter: agendaForm.presenter,
          notes: agendaForm.notes,
        }),
      })

      await fetchAgenda()
      closeAgendaModal()
    } finally {
      setAgendaSaving(false)
    }
  }

  const questionColumns = [
    { key: 'question_id', label: 'Auto Code' },
    { key: 'question_text', label: 'Question' },
    { key: 'answer_text', label: 'Answer' },
    {
      key: 'status',
      label: 'Status',
      render: (row: QuestionItem) => (
        <Badge text={row.status ?? 'open'} variant={questionStatusVariant(row.status)} />
      ),
    },
  ]

  const fitGapColumns = [
    { key: 'gap_id', label: 'Gap ID' },
    { key: 'gap_description', label: 'Description' },
    { key: 'solution_type', label: 'Solution' },
    { key: 'priority', label: 'Priority' },
    { key: 'fit_gap_status', label: 'Status' },
  ]

  const decisionColumns = [
    { key: 'decision_id', label: 'Decision ID' },
    {
      key: 'title',
      label: 'Title',
      render: (row: DecisionItem) => (
        <span className="font-semibold text-gray-900">{row.title ?? ''}</span>
      ),
    },
    {
      key: 'impact',
      label: 'Impact',
      render: (row: DecisionItem) => (
        <Badge text={row.impact ?? 'medium'} variant={decisionImpactVariant(row.impact)} />
      ),
    },
    { key: 'decided_by', label: 'Decided By' },
    { key: 'decision_date', label: 'Decision Date' },
  ]

  const riskColumns = [
    { key: 'item_id', label: 'Item ID' },
    { key: 'type', label: 'Type' },
    { key: 'description', label: 'Description' },
    { key: 'probability', label: 'Prob' },
    { key: 'impact', label: 'Impact' },
    {
      key: 'risk_score',
      label: 'Score',
      render: (row: RiskItem) => (
        <Badge
          text={row.risk_score ? String(row.risk_score) : '-'}
          variant={riskScoreVariant(row.risk_score)}
        />
      ),
    },
    { key: 'owner', label: 'Owner' },
  ]

  const actionColumns = [
    { key: 'action_id', label: 'Action ID' },
    { key: 'title', label: 'Title' },
    { key: 'assigned_to', label: 'Assigned To' },
    { key: 'due_date', label: 'Due Date' },
    {
      key: 'status',
      label: 'Status',
      render: (row: ActionItem) => (
        <Badge text={row.status ?? 'open'} variant={actionStatusVariant(row.status)} />
      ),
    },
  ]

  const attendeeColumns = [
    { key: 'name', label: 'Name' },
    { key: 'role', label: 'Role' },
    { key: 'email', label: 'Email' },
    { key: 'department', label: 'Department' },
  ]

  const agendaColumns = [
    { key: 'topic', label: 'Topic' },
    { key: 'duration', label: 'Duration (min)' },
    { key: 'presenter', label: 'Presenter' },
    { key: 'notes', label: 'Notes' },
  ]

  const tabButtonClass = (tabKey: string) =>
    tabKey === activeTab
      ? 'border-b-2 border-blue-500 px-2 pb-2 text-blue-600 font-semibold'
      : 'px-2 pb-2 text-gray-500 hover:text-gray-700'

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-2">
          <Button variant="secondary" onClick={() => navigate('/analysis')}>
            Back
          </Button>
          {sessionLoading ? (
            <div className="text-sm text-gray-500">Loading session...</div>
          ) : session ? (
            <div className="space-y-1">
              <h1 className="text-2xl font-semibold text-gray-900">
                {session.session_name}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                <span>{session.session_code ?? 'No Code'}</span>
                <span>{session.module ?? 'Module N/A'}</span>
                <span>{session.facilitator ?? 'Facilitator N/A'}</span>
                <Badge
                  text={session.status ?? 'planned'}
                  variant={sessionStatusVariant(session.status)}
                />
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-500">Session not found.</div>
          )}
        </div>
      </div>

      <div className="border-b border-gray-200">
        <div className="flex flex-wrap gap-6">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={tabButtonClass(tab.key)}
              onClick={() => setActiveTab(tab.key)}
              type="button"
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'questions' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Questions</h2>
            <Button size="sm" onClick={openQuestionModal}>
              Add Question
            </Button>
          </div>
          <DataTable
            columns={questionColumns}
            data={questions}
            loading={questionsLoading}
            onRowClick={openQuestionEdit}
            emptyMessage="No questions yet"
          />
        </div>
      )}

      {activeTab === 'fitgap' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Fit-Gap</h2>
            <Button size="sm" onClick={openFitGapModal}>
              Add Fit-Gap
            </Button>
          </div>
          <DataTable
            columns={fitGapColumns}
            data={fitGaps}
            loading={fitGapLoading}
            onRowClick={openFitGapEdit}
            emptyMessage="No fit-gap items yet"
          />
        </div>
      )}

      {activeTab === 'decisions' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Decisions</h2>
            <Button size="sm" onClick={openDecisionModal}>
              Add Decision
            </Button>
          </div>
          <DataTable
            columns={decisionColumns}
            data={decisions}
            loading={decisionsLoading}
            onRowClick={openDecisionEdit}
            emptyMessage="No decisions yet"
          />
        </div>
      )}

      {activeTab === 'risks' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Risks</h2>
            <Button size="sm" onClick={openRiskModal}>
              Add Risk
            </Button>
          </div>
          <DataTable
            columns={riskColumns}
            data={risks}
            loading={risksLoading}
            onRowClick={openRiskEdit}
            emptyMessage="No risks yet"
          />
        </div>
      )}

      {activeTab === 'actions' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Actions</h2>
            <Button size="sm" onClick={openActionModal}>
              Add Action
            </Button>
          </div>
          <DataTable
            columns={actionColumns}
            data={actions}
            loading={actionsLoading}
            onRowClick={openActionEdit}
            emptyMessage="No actions yet"
          />
        </div>
      )}

      {activeTab === 'attendees' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Attendees</h2>
            <Button size="sm" onClick={openAttendeeModal}>
              Add Attendee
            </Button>
          </div>
          <DataTable
            columns={attendeeColumns}
            data={attendees}
            loading={attendeesLoading}
            onRowClick={openAttendeeEdit}
            emptyMessage="No attendees yet"
          />
        </div>
      )}

      {activeTab === 'agenda' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Agenda</h2>
            <Button size="sm" onClick={openAgendaModal}>
              Add Agenda Item
            </Button>
          </div>
          <DataTable
            columns={agendaColumns}
            data={agendaItems}
            loading={agendaLoading}
            onRowClick={openAgendaEdit}
            emptyMessage="No agenda items yet"
          />
        </div>
      )}

      <Modal
        isOpen={questionModalOpen}
        onClose={closeQuestionModal}
        title={editingQuestion ? 'Edit Question' : 'Add Question'}
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Question</label>
            <textarea
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
              onChange={handleQuestionChange('question_text')}
              rows={3}
              value={questionForm.question_text}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Answer</label>
            <textarea
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
              onChange={handleQuestionChange('answer_text')}
              rows={3}
              value={questionForm.answer_text}
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-gray-700">Status</label>
              <select
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                onChange={handleQuestionChange('status')}
                value={questionForm.status}
              >
                <option value="open">Open</option>
                <option value="answered">Answered</option>
                <option value="deferred">Deferred</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Asked By</label>
              <input
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                onChange={handleQuestionChange('asked_by')}
                value={questionForm.asked_by}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Assigned To</label>
              <input
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                onChange={handleQuestionChange('assigned_to')}
                value={questionForm.assigned_to}
              />
            </div>
          </div>
          <div className="flex items-center justify-end gap-2">
            <Button variant="secondary" onClick={closeQuestionModal}>
              Cancel
            </Button>
            <Button onClick={saveQuestion} loading={questionSaving}>
              Save
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={fitGapModalOpen}
        onClose={closeFitGapModal}
        title={editingFitGap ? 'Edit Fit-Gap' : 'Add Fit-Gap'}
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-gray-700">Gap ID</label>
              <input
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                onChange={handleFitGapChange('gap_id')}
                value={fitGapForm.gap_id}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Solution Type</label>
              <select
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                onChange={handleFitGapChange('solution_type')}
                value={fitGapForm.solution_type}
              >
                <option value="standard">Standard</option>
                <option value="config">Config</option>
                <option value="custom_dev">Custom Dev</option>
                <option value="workaround">Workaround</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Priority</label>
              <select
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                onChange={handleFitGapChange('priority')}
                value={fitGapForm.priority}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Status</label>
              <select
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                onChange={handleFitGapChange('status')}
                value={fitGapForm.status}
              >
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Gap Description</label>
            <textarea
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
              onChange={handleFitGapChange('gap_description')}
              rows={3}
              value={fitGapForm.gap_description}
            />
          </div>
          <div className="flex items-center justify-end gap-2">
            <Button variant="secondary" onClick={closeFitGapModal}>
              Cancel
            </Button>
            <Button onClick={saveFitGap} loading={fitGapSaving}>
              Save
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={decisionModalOpen}
        onClose={closeDecisionModal}
        title={editingDecision ? 'Edit Decision' : 'Add Decision'}
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-gray-700">Decision ID</label>
              <input
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                onChange={handleDecisionChange('decision_id')}
                value={decisionForm.decision_id}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Impact</label>
              <select
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                onChange={handleDecisionChange('impact')}
                value={decisionForm.impact}
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Decided By</label>
              <input
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                onChange={handleDecisionChange('decided_by')}
                value={decisionForm.decided_by}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Decision Date</label>
              <input
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                onChange={handleDecisionChange('decision_date')}
                type="date"
                value={decisionForm.decision_date}
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Title</label>
            <input
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
              onChange={handleDecisionChange('title')}
              value={decisionForm.title}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Description</label>
            <textarea
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
              onChange={handleDecisionChange('description')}
              rows={3}
              value={decisionForm.description}
            />
          </div>
          <div className="flex items-center justify-end gap-2">
            <Button variant="secondary" onClick={closeDecisionModal}>
              Cancel
            </Button>
            <Button onClick={saveDecision} loading={decisionSaving}>
              Save
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={riskModalOpen}
        onClose={closeRiskModal}
        title={editingRisk ? 'Edit Risk' : 'Add Risk'}
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-gray-700">Item ID</label>
              <input
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                onChange={handleRiskChange('item_id')}
                value={riskForm.item_id}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Type</label>
              <select
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                onChange={handleRiskChange('type')}
                value={riskForm.type}
              >
                <option value="risk">Risk</option>
                <option value="issue">Issue</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Probability (1-5)</label>
              <input
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                max={5}
                min={1}
                onChange={handleRiskChange('probability')}
                type="number"
                value={riskForm.probability}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Impact (1-5)</label>
              <input
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                max={5}
                min={1}
                onChange={handleRiskChange('impact')}
                type="number"
                value={riskForm.impact}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Owner</label>
              <input
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                onChange={handleRiskChange('owner')}
                value={riskForm.owner}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Status</label>
              <select
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                onChange={handleRiskChange('status')}
                value={riskForm.status}
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
              onChange={handleRiskChange('description')}
              rows={3}
              value={riskForm.description}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Mitigation</label>
            <textarea
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
              onChange={handleRiskChange('mitigation')}
              rows={3}
              value={riskForm.mitigation}
            />
          </div>
          <div className="flex items-center justify-end gap-2">
            <Button variant="secondary" onClick={closeRiskModal}>
              Cancel
            </Button>
            <Button onClick={saveRisk} loading={riskSaving}>
              Save
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={actionModalOpen}
        onClose={closeActionModal}
        title={editingAction ? 'Edit Action' : 'Add Action'}
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-gray-700">Action ID</label>
              <input
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                onChange={handleActionChange('action_id')}
                value={actionForm.action_id}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Assigned To</label>
              <input
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                onChange={handleActionChange('assigned_to')}
                value={actionForm.assigned_to}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Due Date</label>
              <input
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                onChange={handleActionChange('due_date')}
                type="date"
                value={actionForm.due_date}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Status</label>
              <select
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                onChange={handleActionChange('status')}
                value={actionForm.status}
              >
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Title</label>
            <input
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
              onChange={handleActionChange('title')}
              value={actionForm.title}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Description</label>
            <textarea
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
              onChange={handleActionChange('description')}
              rows={3}
              value={actionForm.description}
            />
          </div>
          <div className="flex items-center justify-end gap-2">
            <Button variant="secondary" onClick={closeActionModal}>
              Cancel
            </Button>
            <Button onClick={saveAction} loading={actionSaving}>
              Save
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={attendeeModalOpen}
        onClose={closeAttendeeModal}
        title={editingAttendee ? 'Edit Attendee' : 'Add Attendee'}
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-gray-700">Name</label>
              <input
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                onChange={handleAttendeeChange('name')}
                value={attendeeForm.name}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Role</label>
              <input
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                onChange={handleAttendeeChange('role')}
                value={attendeeForm.role}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                onChange={handleAttendeeChange('email')}
                value={attendeeForm.email}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Department</label>
              <input
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                onChange={handleAttendeeChange('department')}
                value={attendeeForm.department}
              />
            </div>
          </div>
          <div className="flex items-center justify-end gap-2">
            <Button variant="secondary" onClick={closeAttendeeModal}>
              Cancel
            </Button>
            <Button onClick={saveAttendee} loading={attendeeSaving}>
              Save
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={agendaModalOpen}
        onClose={closeAgendaModal}
        title={editingAgenda ? 'Edit Agenda Item' : 'Add Agenda Item'}
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-gray-700">Topic</label>
              <input
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                onChange={handleAgendaChange('topic')}
                value={agendaForm.topic}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Duration (min)</label>
              <input
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                onChange={handleAgendaChange('duration')}
                type="number"
                value={agendaForm.duration}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Presenter</label>
              <input
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                onChange={handleAgendaChange('presenter')}
                value={agendaForm.presenter}
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Notes</label>
            <textarea
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
              onChange={handleAgendaChange('notes')}
              rows={3}
              value={agendaForm.notes}
            />
          </div>
          <div className="flex items-center justify-end gap-2">
            <Button variant="secondary" onClick={closeAgendaModal}>
              Cancel
            </Button>
            <Button onClick={saveAgenda} loading={agendaSaving}>
              Save
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
