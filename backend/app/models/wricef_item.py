from sqlalchemy import Column, Integer, String, Text
from ..core.database import Base


class WricefItem(Base):
    __tablename__ = "wricef_items"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String)
    project_id = Column(Integer)
    requirement_id = Column(Integer)
    scenario_id = Column(Integer)
    wricef_type = Column(String, default="E")
    title = Column(String, nullable=False)
    description = Column(Text)
    status = Column(String, default="identified")
    priority = Column(String)
    complexity = Column(String)
    estimated_effort = Column(String)
    assigned_to = Column(String)
    functional_spec = Column(Text)
    technical_spec = Column(Text)
    unit_test_steps = Column(Text)
    created_at = Column(String)
    updated_at = Column(String)
