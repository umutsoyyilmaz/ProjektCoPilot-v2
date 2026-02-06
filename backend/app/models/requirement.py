from sqlalchemy import Column, Integer, String, Text
from ..core.database import Base


class Requirement(Base):
    __tablename__ = "new_requirements"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String)
    title = Column(String, nullable=False)
    description = Column(Text)
    classification = Column(String)
    module = Column(String)
    priority = Column(String)
    status = Column(String, default="open")
    session_id = Column(Integer)
    project_id = Column(Integer)
    gap_id = Column(String)
    analysis_id = Column(Integer)
    fit_type = Column(String)
    conversion_status = Column(String)
    conversion_type = Column(String)
    conversion_id = Column(Integer)
    converted_at = Column(String)
    converted_by = Column(String)
    created_at = Column(String)
    updated_at = Column(String)
