from pydantic import BaseModel, ConfigDict
from typing import Optional


class DecisionBase(BaseModel):
    session_id: Optional[int] = None
    decision_id: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None
    impact: Optional[str] = None
    decided_by: Optional[str] = None
    decision_date: Optional[str] = None
    status: Optional[str] = "pending"
    related_gap_id: Optional[str] = None


class DecisionCreate(DecisionBase):
    pass


class DecisionUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    impact: Optional[str] = None
    decided_by: Optional[str] = None
    decision_date: Optional[str] = None
    status: Optional[str] = None
    related_gap_id: Optional[str] = None


class DecisionResponse(DecisionBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    created_at: Optional[str] = None
