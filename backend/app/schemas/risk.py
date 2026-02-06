from pydantic import BaseModel, ConfigDict
from typing import Optional


class RiskBase(BaseModel):
    session_id: Optional[int] = None
    item_id: Optional[str] = None
    type: Optional[str] = "risk"
    title: Optional[str] = None
    description: Optional[str] = None
    probability: Optional[str] = None
    impact: Optional[str] = None
    risk_score: Optional[float] = None
    mitigation_plan: Optional[str] = None
    owner: Optional[str] = None
    status: Optional[str] = "open"
    due_date: Optional[str] = None


class RiskCreate(RiskBase):
    pass


class RiskUpdate(BaseModel):
    type: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None
    probability: Optional[str] = None
    impact: Optional[str] = None
    risk_score: Optional[float] = None
    mitigation_plan: Optional[str] = None
    owner: Optional[str] = None
    status: Optional[str] = None
    due_date: Optional[str] = None


class RiskResponse(RiskBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    created_at: Optional[str] = None
