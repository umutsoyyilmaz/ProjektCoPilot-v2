from sqlalchemy import Column, Integer, String, Text
from ..core.database import Base


class Decision(Base):
    __tablename__ = "decisions"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer)
    decision_id = Column(String)
    title = Column(String)
    description = Column(Text)
    impact = Column(String)
    decided_by = Column(String)
    decision_date = Column(String)
    status = Column(String, default="pending")
    related_gap_id = Column(String)
    created_at = Column(String)
