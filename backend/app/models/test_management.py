from sqlalchemy import Column, Integer, String, Text
from ..core.database import Base


class TestManagement(Base):
    __tablename__ = "test_management"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String)
    project_id = Column(Integer)
    test_type = Column(String, default="unit")
    title = Column(String, nullable=False)
    description = Column(Text)
    status = Column(String, default="not_started")
    priority = Column(String)
    source_type = Column(String)
    source_id = Column(Integer)
    preconditions = Column(Text)
    steps = Column(Text)
    expected_result = Column(Text)
    actual_result = Column(Text)
    assigned_to = Column(String)
    execution_date = Column(String)
    created_at = Column(String)
    updated_at = Column(String)
