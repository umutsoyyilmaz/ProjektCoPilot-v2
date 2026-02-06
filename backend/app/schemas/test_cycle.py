from pydantic import BaseModel, ConfigDict
from typing import Optional


class TestCycleBase(BaseModel):
    project_id: Optional[int] = None
    cycle_code: Optional[str] = None
    name: str
    description: Optional[str] = None
    cycle_type: Optional[str] = "sit"
    status: Optional[str] = "planned"
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    total_tests: Optional[int] = 0
    passed_tests: Optional[int] = 0
    failed_tests: Optional[int] = 0
    blocked_tests: Optional[int] = 0
    completion_percentage: Optional[float] = 0.0


class TestCycleCreate(TestCycleBase):
    pass


class TestCycleUpdate(BaseModel):
    project_id: Optional[int] = None
    cycle_code: Optional[str] = None
    name: Optional[str] = None
    description: Optional[str] = None
    cycle_type: Optional[str] = None
    status: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    total_tests: Optional[int] = None
    passed_tests: Optional[int] = None
    failed_tests: Optional[int] = None
    blocked_tests: Optional[int] = None
    completion_percentage: Optional[float] = None


class TestCycleResponse(TestCycleBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    created_at: Optional[str] = None
    updated_at: Optional[str] = None
