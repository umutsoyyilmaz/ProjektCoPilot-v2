from sqlalchemy import Column, Integer, String, Text
from ..core.database import Base


class Agenda(Base):
    __tablename__ = "session_agenda"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer)
    topic = Column(String)
    description = Column(Text)
    duration = Column(String)
    presenter = Column(String)
    sort_order = Column(Integer)
    notes = Column(Text)
    status = Column(String)
