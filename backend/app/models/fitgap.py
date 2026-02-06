from sqlalchemy import Column, Integer, String, Text
from ..core.database import Base


class FitGap(Base):
    __tablename__ = "fitgap"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer)
    gap_id = Column(String)
    process_area = Column(String)
    gap_description = Column(Text)
    fit_gap_status = Column(String)
    solution_type = Column(String)
    priority = Column(String)
    effort_estimate = Column(String)
    assigned_to = Column(String)
    related_decision_id = Column(String)
    related_wricef_id = Column(String)
    notes = Column(Text)
    created_at = Column(String)
