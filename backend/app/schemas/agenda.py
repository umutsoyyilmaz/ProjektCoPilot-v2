from pydantic import BaseModel, ConfigDict
from typing import Optional


class AgendaBase(BaseModel):
    session_id: Optional[int] = None
    topic: Optional[str] = None
    description: Optional[str] = None
    duration: Optional[str] = None
    presenter: Optional[str] = None
    sort_order: Optional[int] = None
    notes: Optional[str] = None
    status: Optional[str] = None


class AgendaCreate(AgendaBase):
    pass


class AgendaUpdate(BaseModel):
    topic: Optional[str] = None
    description: Optional[str] = None
    duration: Optional[str] = None
    presenter: Optional[str] = None
    sort_order: Optional[int] = None
    notes: Optional[str] = None
    status: Optional[str] = None


class AgendaResponse(AgendaBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
