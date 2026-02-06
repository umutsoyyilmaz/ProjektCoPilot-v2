from sqlalchemy import Column, Integer, String
from ..core.database import Base


class Attendee(Base):
    __tablename__ = "session_attendees"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer)
    name = Column(String)
    role = Column(String)
    email = Column(String)
    department = Column(String)
    attendance_status = Column(String)
