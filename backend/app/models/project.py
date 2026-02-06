from sqlalchemy import Column, Integer, String, Text
from ..core.database import Base


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    project_code = Column(String)
    project_name = Column(String, nullable=False)
    customer_name = Column(String)
    customer_industry = Column(String)
    description = Column(Text)
    status = Column(String, default="planning")
    start_date = Column(String)
    end_date = Column(String)
    go_live_date = Column(String)
    project_manager = Column(String)
    solution_architect = Column(String)
    functional_lead = Column(String)
    technical_lead = Column(String)
    created_at = Column(String)
