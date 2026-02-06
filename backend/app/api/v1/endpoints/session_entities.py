from datetime import datetime
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ....core.database import get_db
from ....models.question import Question
from ....models.fitgap import FitGap
from ....models.decision import Decision
from ....models.risk import Risk
from ....models.action import Action
from ....models.attendee import Attendee
from ....models.agenda import Agenda
from ....schemas.question import QuestionCreate, QuestionUpdate, QuestionResponse
from ....schemas.fitgap import FitGapCreate, FitGapUpdate, FitGapResponse
from ....schemas.decision import DecisionCreate, DecisionUpdate, DecisionResponse
from ....schemas.risk import RiskCreate, RiskUpdate, RiskResponse
from ....schemas.action import ActionCreate, ActionUpdate, ActionResponse
from ....schemas.attendee import AttendeeCreate, AttendeeUpdate, AttendeeResponse
from ....schemas.agenda import AgendaCreate, AgendaUpdate, AgendaResponse
from ._crud_helper import list_items, get_item, create_item, update_item, delete_item

router = APIRouter(tags=["Session Entities"])


# ─── Questions ───
@router.get("/sessions/{session_id}/questions", response_model=list[QuestionResponse])
def get_questions(session_id: int, db: Session = Depends(get_db)):
    return list_items(db, Question, {"session_id": session_id})


@router.post("/sessions/{session_id}/questions", response_model=QuestionResponse, status_code=201)
def create_question(session_id: int, data: QuestionCreate, db: Session = Depends(get_db)):
    return create_item(db, Question, data, extra={"session_id": session_id})


@router.put("/questions/{item_id}", response_model=QuestionResponse)
def update_question(item_id: int, data: QuestionUpdate, db: Session = Depends(get_db)):
    return update_item(db, Question, item_id, data)


@router.delete("/questions/{item_id}")
def delete_question(item_id: int, db: Session = Depends(get_db)):
    return delete_item(db, Question, item_id)


# ─── FitGap ───
@router.get("/sessions/{session_id}/fitgap", response_model=list[FitGapResponse])
def get_fitgaps(session_id: int, db: Session = Depends(get_db)):
    return list_items(db, FitGap, {"session_id": session_id})


@router.post("/sessions/{session_id}/fitgap", response_model=FitGapResponse, status_code=201)
def create_fitgap(session_id: int, data: FitGapCreate, db: Session = Depends(get_db)):
    return create_item(db, FitGap, data, extra={"session_id": session_id})


@router.put("/fitgap/{item_id}", response_model=FitGapResponse)
def update_fitgap(item_id: int, data: FitGapUpdate, db: Session = Depends(get_db)):
    return update_item(db, FitGap, item_id, data)


@router.delete("/fitgap/{item_id}")
def delete_fitgap(item_id: int, db: Session = Depends(get_db)):
    return delete_item(db, FitGap, item_id)


# ─── Decisions ───
@router.get("/sessions/{session_id}/decisions", response_model=list[DecisionResponse])
def get_decisions(session_id: int, db: Session = Depends(get_db)):
    return list_items(db, Decision, {"session_id": session_id})


@router.post("/sessions/{session_id}/decisions", response_model=DecisionResponse, status_code=201)
def create_decision(session_id: int, data: DecisionCreate, db: Session = Depends(get_db)):
    return create_item(db, Decision, data, extra={"session_id": session_id})


@router.put("/decisions/{item_id}", response_model=DecisionResponse)
def update_decision(item_id: int, data: DecisionUpdate, db: Session = Depends(get_db)):
    return update_item(db, Decision, item_id, data)


@router.delete("/decisions/{item_id}")
def delete_decision(item_id: int, db: Session = Depends(get_db)):
    return delete_item(db, Decision, item_id)


# ─── Risks ───
@router.get("/sessions/{session_id}/risks", response_model=list[RiskResponse])
def get_risks(session_id: int, db: Session = Depends(get_db)):
    return list_items(db, Risk, {"session_id": session_id})


@router.post("/sessions/{session_id}/risks", response_model=RiskResponse, status_code=201)
def create_risk(session_id: int, data: RiskCreate, db: Session = Depends(get_db)):
    return create_item(db, Risk, data, extra={"session_id": session_id})


@router.put("/risks/{item_id}", response_model=RiskResponse)
def update_risk(item_id: int, data: RiskUpdate, db: Session = Depends(get_db)):
    return update_item(db, Risk, item_id, data)


@router.delete("/risks/{item_id}")
def delete_risk(item_id: int, db: Session = Depends(get_db)):
    return delete_item(db, Risk, item_id)


# ─── Actions ───
@router.get("/sessions/{session_id}/actions", response_model=list[ActionResponse])
def get_actions(session_id: int, db: Session = Depends(get_db)):
    return list_items(db, Action, {"session_id": session_id})


@router.post("/sessions/{session_id}/actions", response_model=ActionResponse, status_code=201)
def create_action(session_id: int, data: ActionCreate, db: Session = Depends(get_db)):
    return create_item(db, Action, data, extra={"session_id": session_id})


@router.put("/actions/{item_id}", response_model=ActionResponse)
def update_action(item_id: int, data: ActionUpdate, db: Session = Depends(get_db)):
    return update_item(db, Action, item_id, data)


@router.delete("/actions/{item_id}")
def delete_action(item_id: int, db: Session = Depends(get_db)):
    return delete_item(db, Action, item_id)


# ─── Attendees ───
@router.get("/sessions/{session_id}/attendees", response_model=list[AttendeeResponse])
def get_attendees(session_id: int, db: Session = Depends(get_db)):
    return list_items(db, Attendee, {"session_id": session_id})


@router.post("/sessions/{session_id}/attendees", response_model=AttendeeResponse, status_code=201)
def create_attendee(session_id: int, data: AttendeeCreate, db: Session = Depends(get_db)):
    return create_item(db, Attendee, data, extra={"session_id": session_id})


@router.put("/attendees/{item_id}", response_model=AttendeeResponse)
def update_attendee(item_id: int, data: AttendeeUpdate, db: Session = Depends(get_db)):
    return update_item(db, Attendee, item_id, data)


@router.delete("/attendees/{item_id}")
def delete_attendee(item_id: int, db: Session = Depends(get_db)):
    return delete_item(db, Attendee, item_id)


# ─── Agenda ───
@router.get("/sessions/{session_id}/agenda", response_model=list[AgendaResponse])
def get_agenda(session_id: int, db: Session = Depends(get_db)):
    return list_items(db, Agenda, {"session_id": session_id})


@router.post("/sessions/{session_id}/agenda", response_model=AgendaResponse, status_code=201)
def create_agenda(session_id: int, data: AgendaCreate, db: Session = Depends(get_db)):
    return create_item(db, Agenda, data, extra={"session_id": session_id})


@router.put("/agenda/{item_id}", response_model=AgendaResponse)
def update_agenda(item_id: int, data: AgendaUpdate, db: Session = Depends(get_db)):
    return update_item(db, Agenda, item_id, data)


@router.delete("/agenda/{item_id}")
def delete_agenda(item_id: int, db: Session = Depends(get_db)):
    return delete_item(db, Agenda, item_id)
