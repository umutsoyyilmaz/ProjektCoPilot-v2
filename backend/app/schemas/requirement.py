from pydantic import BaseModel, ConfigDict
from typing import Optional


class RequirementBase(BaseModel):
    code: Optional[str] = None
    title: str
    description: Optional[str] = None
    classification: Optional[str] = None
    module: Optional[str] = None
    priority: Optional[str] = None
    status: Optional[str] = "open"
    session_id: Optional[int] = None
    project_id: Optional[int] = None
    gap_id: Optional[str] = None
    analysis_id: Optional[int] = None
    fit_type: Optional[str] = None


class RequirementCreate(RequirementBase):
    pass


class RequirementUpdate(BaseModel):
    code: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None
    classification: Optional[str] = None
    module: Optional[str] = None
    priority: Optional[str] = None
    status: Optional[str] = None
    session_id: Optional[int] = None
    project_id: Optional[int] = None
    gap_id: Optional[str] = None
    analysis_id: Optional[int] = None
    fit_type: Optional[str] = None
    conversion_status: Optional[str] = None
    conversion_type: Optional[str] = None
    conversion_id: Optional[int] = None
    converted_at: Optional[str] = None
    converted_by: Optional[str] = None


class RequirementResponse(RequirementBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    conversion_status: Optional[str] = None
    conversion_type: Optional[str] = None
    conversion_id: Optional[int] = None
    converted_at: Optional[str] = None
    converted_by: Optional[str] = None
    created_at: Optional[str] = None
    updated_at: Optional[str] = None
