from pydantic import BaseModel, ConfigDict
from typing import Optional


class ActionBase(BaseModel):
    session_id: Optional[int] = None
    action_id: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None
    assigned_to: Optional[str] = None
    due_date: Optional[str] = None
    status: Optional[str] = "open"
    priority: Optional[str] = None
    related_decision_id: Optional[str] = None


class ActionCreate(ActionBase):
    pass


class ActionUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    assigned_to: Optional[str] = None
    due_date: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    related_decision_id: Optional[str] = None


class ActionResponse(ActionBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    created_at: Optional[str] = None
