from pydantic import BaseModel, ConfigDict
from typing import Optional


class WricefItemBase(BaseModel):
    code: Optional[str] = None
    project_id: Optional[int] = None
    requirement_id: Optional[int] = None
    scenario_id: Optional[int] = None
    wricef_type: Optional[str] = "E"
    title: str
    description: Optional[str] = None
    status: Optional[str] = "identified"
    priority: Optional[str] = None
    complexity: Optional[str] = None
    estimated_effort: Optional[str] = None
    assigned_to: Optional[str] = None
    functional_spec: Optional[str] = None
    technical_spec: Optional[str] = None
    unit_test_steps: Optional[str] = None


class WricefItemCreate(WricefItemBase):
    pass


class WricefItemUpdate(BaseModel):
    code: Optional[str] = None
    project_id: Optional[int] = None
    requirement_id: Optional[int] = None
    scenario_id: Optional[int] = None
    wricef_type: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    complexity: Optional[str] = None
    estimated_effort: Optional[str] = None
    assigned_to: Optional[str] = None
    functional_spec: Optional[str] = None
    technical_spec: Optional[str] = None
    unit_test_steps: Optional[str] = None


class WricefItemResponse(WricefItemBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    created_at: Optional[str] = None
    updated_at: Optional[str] = None
