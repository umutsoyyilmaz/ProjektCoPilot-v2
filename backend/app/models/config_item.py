from sqlalchemy import Column, Integer, String, Text
from ..core.database import Base


class ConfigItem(Base):
    __tablename__ = "config_items"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String)
    project_id = Column(Integer)
    requirement_id = Column(Integer)
    scenario_id = Column(Integer)
    config_type = Column(String, default="standard")
    title = Column(String, nullable=False)
    description = Column(Text)
    status = Column(String, default="planned")
    t_code = Column(String)
    config_details = Column(Text)
    unit_test_steps = Column(Text)
    created_at = Column(String)
    updated_at = Column(String)
