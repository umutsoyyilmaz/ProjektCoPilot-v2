from pydantic import BaseModel, ConfigDict
from typing import Optional


class ProjectBase(BaseModel):
    project_code: Optional[str] = None
    project_name: str
    customer_name: Optional[str] = None
    customer_industry: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = "planning"
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    go_live_date: Optional[str] = None
    project_manager: Optional[str] = None
    solution_architect: Optional[str] = None
    functional_lead: Optional[str] = None
    technical_lead: Optional[str] = None


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(BaseModel):
    project_code: Optional[str] = None
    project_name: Optional[str] = None
    customer_name: Optional[str] = None
    customer_industry: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    go_live_date: Optional[str] = None
    project_manager: Optional[str] = None
    solution_architect: Optional[str] = None
    functional_lead: Optional[str] = None
    technical_lead: Optional[str] = None


class ProjectResponse(ProjectBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    created_at: Optional[str] = None
