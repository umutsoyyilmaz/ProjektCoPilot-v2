from pydantic import BaseModel, ConfigDict
from typing import Optional


class FitGapBase(BaseModel):
    session_id: Optional[int] = None
    gap_id: Optional[str] = None
    process_area: Optional[str] = None
    gap_description: Optional[str] = None
    fit_gap_status: Optional[str] = None
    solution_type: Optional[str] = None
    priority: Optional[str] = None
    effort_estimate: Optional[str] = None
    assigned_to: Optional[str] = None
    related_decision_id: Optional[str] = None
    related_wricef_id: Optional[str] = None
    notes: Optional[str] = None


class FitGapCreate(FitGapBase):
    pass


class FitGapUpdate(BaseModel):
    process_area: Optional[str] = None
    gap_description: Optional[str] = None
    fit_gap_status: Optional[str] = None
    solution_type: Optional[str] = None
    priority: Optional[str] = None
    effort_estimate: Optional[str] = None
    assigned_to: Optional[str] = None
    related_decision_id: Optional[str] = None
    related_wricef_id: Optional[str] = None
    notes: Optional[str] = None


class FitGapResponse(FitGapBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    created_at: Optional[str] = None
