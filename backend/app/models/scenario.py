from sqlalchemy import Column, Integer, String, Text
from ..core.database import Base


class Scenario(Base):
    __tablename__ = "scenarios"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer)
    scenario_id = Column(String)
    name = Column(String, nullable=False)
    module = Column(String)
    description = Column(Text)
    status = Column(String, default="draft")
    priority = Column(String)
    is_composite = Column(Integer, default=0)
    included_scenario_ids = Column(String)
    created_at = Column(String)
    updated_at = Column(String)
