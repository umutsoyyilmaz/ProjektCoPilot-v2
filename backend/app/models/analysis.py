from sqlalchemy import Column, Integer, String, Text
from ..core.database import Base


class Analysis(Base):
    __tablename__ = "analyses"

    id = Column(Integer, primary_key=True, index=True)
    scenario_id = Column(Integer)
    code = Column(String)
    title = Column(String, nullable=False)
    analysis_type = Column(String, default="workshop")
    status = Column(String, default="planned")
    description = Column(Text)
    scheduled_date = Column(String)
    completed_date = Column(String)
    created_at = Column(String)
    updated_at = Column(String)
