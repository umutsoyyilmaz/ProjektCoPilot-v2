from sqlalchemy import Column, Integer, String, Text, Float
from ..core.database import Base


class Risk(Base):
    __tablename__ = "risks_issues"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer)
    item_id = Column(String)
    type = Column(String, default="risk")
    title = Column(String)
    description = Column(Text)
    probability = Column(String)
    impact = Column(String)
    risk_score = Column(Float)
    mitigation_plan = Column(Text)
    owner = Column(String)
    status = Column(String, default="open")
    due_date = Column(String)
    created_at = Column(String)
