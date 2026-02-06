from sqlalchemy import Column, Integer, String, Text
from ..core.database import Base


class TestExecution(Base):
    __tablename__ = "test_executions"

    id = Column(Integer, primary_key=True, index=True)
    test_cycle_id = Column(Integer)
    test_case_id = Column(Integer)
    execution_code = Column(String)
    status = Column(String, default="not_run")
    executed_by = Column(String)
    execution_date = Column(String)
    actual_result = Column(Text)
    notes = Column(Text)
    defect_id = Column(String)
    created_at = Column(String)
