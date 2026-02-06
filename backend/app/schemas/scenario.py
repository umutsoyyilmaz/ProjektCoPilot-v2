from pydantic import BaseModel, ConfigDict
from typing import Optional


class ScenarioBase(BaseModel):
    project_id: Optional[int] = None
    scenario_id: Optional[str] = None
    name: str
    module: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = "draft"
    priority: Optional[str] = None
    is_composite: Optional[int] = 0
    included_scenario_ids: Optional[str] = None


class ScenarioCreate(ScenarioBase):
    pass


class ScenarioUpdate(BaseModel):
    project_id: Optional[int] = None
    scenario_id: Optional[str] = None
    name: Optional[str] = None
    module: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    is_composite: Optional[int] = None
    included_scenario_ids: Optional[str] = None


class ScenarioResponse(ScenarioBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    created_at: Optional[str] = None
    updated_at: Optional[str] = None
