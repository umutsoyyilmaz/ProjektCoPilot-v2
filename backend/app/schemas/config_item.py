from pydantic import BaseModel, ConfigDict
from typing import Optional


class ConfigItemBase(BaseModel):
    code: Optional[str] = None
    project_id: Optional[int] = None
    requirement_id: Optional[int] = None
    scenario_id: Optional[int] = None
    config_type: Optional[str] = "standard"
    title: str
    description: Optional[str] = None
    status: Optional[str] = "planned"
    t_code: Optional[str] = None
    config_details: Optional[str] = None
    unit_test_steps: Optional[str] = None


class ConfigItemCreate(ConfigItemBase):
    pass


class ConfigItemUpdate(BaseModel):
    code: Optional[str] = None
    project_id: Optional[int] = None
    requirement_id: Optional[int] = None
    scenario_id: Optional[int] = None
    config_type: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    t_code: Optional[str] = None
    config_details: Optional[str] = None
    unit_test_steps: Optional[str] = None


class ConfigItemResponse(ConfigItemBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    created_at: Optional[str] = None
    updated_at: Optional[str] = None
