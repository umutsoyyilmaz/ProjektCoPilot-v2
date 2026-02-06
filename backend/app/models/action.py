from sqlalchemy import Column, Integer, String, Text
from ..core.database import Base


class Action(Base):
    __tablename__ = "action_items"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer)
    action_id = Column(String)
    title = Column(String)
    description = Column(Text)
    assigned_to = Column(String)
    due_date = Column(String)
    status = Column(String, default="open")
    priority = Column(String)
    related_decision_id = Column(String)
    created_at = Column(String)
