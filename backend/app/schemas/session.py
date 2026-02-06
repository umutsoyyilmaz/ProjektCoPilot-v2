from pydantic import BaseModel, ConfigDict
from typing import Optional


class SessionBase(BaseModel):
    project_id: Optional[int] = None
    scenario_id: Optional[int] = None
    analysis_id: Optional[int] = None
    session_name: str
    session_code: Optional[str] = None
    module: Optional[str] = None
    facilitator: Optional[str] = None
    session_date: Optional[str] = None
    status: Optional[str] = "planned"
    notes: Optional[str] = None
    location: Optional[str] = None
    duration: Optional[str] = None


class SessionCreate(SessionBase):
    pass


class SessionUpdate(BaseModel):
    project_id: Optional[int] = None
    scenario_id: Optional[int] = None
    analysis_id: Optional[int] = None
    session_name: Optional[str] = None
    session_code: Optional[str] = None
    module: Optional[str] = None
    facilitator: Optional[str] = None
    session_date: Optional[str] = None
    status: Optional[str] = None
    notes: Optional[str] = None
    location: Optional[str] = None
    duration: Optional[str] = None


class SessionResponse(SessionBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    created_at: Optional[str] = None
