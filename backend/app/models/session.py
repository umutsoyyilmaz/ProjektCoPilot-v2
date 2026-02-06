from sqlalchemy import Column, Integer, String, Text
from ..core.database import Base


class Session(Base):
    __tablename__ = "analysis_sessions"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer)
    scenario_id = Column(Integer)
    analysis_id = Column(Integer)
    session_name = Column(String, nullable=False)
    session_code = Column(String)
    module = Column(String)
    facilitator = Column(String)
    session_date = Column(String)
    status = Column(String, default="planned")
    notes = Column(Text)
    location = Column(String)
    duration = Column(String)
    created_at = Column(String)
