from pydantic import BaseModel, ConfigDict
from typing import Optional


class AnalysisBase(BaseModel):
    scenario_id: Optional[int] = None
    code: Optional[str] = None
    title: str
    analysis_type: Optional[str] = "workshop"
    status: Optional[str] = "planned"
    description: Optional[str] = None
    scheduled_date: Optional[str] = None
    completed_date: Optional[str] = None


class AnalysisCreate(AnalysisBase):
    pass


class AnalysisUpdate(BaseModel):
    scenario_id: Optional[int] = None
    code: Optional[str] = None
    title: Optional[str] = None
    analysis_type: Optional[str] = None
    status: Optional[str] = None
    description: Optional[str] = None
    scheduled_date: Optional[str] = None
    completed_date: Optional[str] = None


class AnalysisResponse(AnalysisBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    created_at: Optional[str] = None
    updated_at: Optional[str] = None
