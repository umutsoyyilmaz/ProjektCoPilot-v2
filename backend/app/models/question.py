from sqlalchemy import Column, Integer, String, Text
from ..core.database import Base


class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer)
    question_id = Column(String)
    question_text = Column(Text)
    answer_text = Column(Text)
    status = Column(String, default="open")
    priority = Column(String)
    assigned_to = Column(String)
    category = Column(String)
    created_at = Column(String)
