from pydantic import BaseModel, ConfigDict
from typing import Optional


class TestExecutionBase(BaseModel):
    test_cycle_id: Optional[int] = None
    test_case_id: Optional[int] = None
    execution_code: Optional[str] = None
    status: Optional[str] = "not_run"
    executed_by: Optional[str] = None
    execution_date: Optional[str] = None
    actual_result: Optional[str] = None
    notes: Optional[str] = None
    defect_id: Optional[str] = None


class TestExecutionCreate(TestExecutionBase):
    pass


class TestExecutionUpdate(BaseModel):
    test_cycle_id: Optional[int] = None
    test_case_id: Optional[int] = None
    execution_code: Optional[str] = None
    status: Optional[str] = None
    executed_by: Optional[str] = None
    execution_date: Optional[str] = None
    actual_result: Optional[str] = None
    notes: Optional[str] = None
    defect_id: Optional[str] = None


class TestExecutionResponse(TestExecutionBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    created_at: Optional[str] = None
