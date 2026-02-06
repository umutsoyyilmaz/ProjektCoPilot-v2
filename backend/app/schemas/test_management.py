from pydantic import BaseModel, ConfigDict
from typing import Optional


class TestManagementBase(BaseModel):
    code: Optional[str] = None
    project_id: Optional[int] = None
    test_type: Optional[str] = "unit"
    title: str
    description: Optional[str] = None
    status: Optional[str] = "not_started"
    priority: Optional[str] = None
    source_type: Optional[str] = None
    source_id: Optional[int] = None
    preconditions: Optional[str] = None
    steps: Optional[str] = None
    expected_result: Optional[str] = None
    actual_result: Optional[str] = None
    assigned_to: Optional[str] = None
    execution_date: Optional[str] = None


class TestManagementCreate(TestManagementBase):
    pass


class TestManagementUpdate(BaseModel):
    code: Optional[str] = None
    project_id: Optional[int] = None
    test_type: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    source_type: Optional[str] = None
    source_id: Optional[int] = None
    preconditions: Optional[str] = None
    steps: Optional[str] = None
    expected_result: Optional[str] = None
    actual_result: Optional[str] = None
    assigned_to: Optional[str] = None
    execution_date: Optional[str] = None


class TestManagementResponse(TestManagementBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    created_at: Optional[str] = None
    updated_at: Optional[str] = None
