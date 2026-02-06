from sqlalchemy import Column, Integer, String, Text, Float
from ..core.database import Base


class TestCycle(Base):
    __tablename__ = "test_cycles"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer)
    cycle_code = Column(String)
    name = Column(String, nullable=False)
    description = Column(Text)
    cycle_type = Column(String, default="sit")
    status = Column(String, default="planned")
    start_date = Column(String)
    end_date = Column(String)
    total_tests = Column(Integer, default=0)
    passed_tests = Column(Integer, default=0)
    failed_tests = Column(Integer, default=0)
    blocked_tests = Column(Integer, default=0)
    completion_percentage = Column(Float, default=0.0)
    created_at = Column(String)
    updated_at = Column(String)
