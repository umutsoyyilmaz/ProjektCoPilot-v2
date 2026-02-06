from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ....core.database import get_db
from ....models.project import Project
from ....models.scenario import Scenario
from ....models.requirement import Requirement
from ....models.wricef_item import WricefItem
from ....models.config_item import ConfigItem
from ....models.test_management import TestManagement

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/stats")
def get_dashboard_stats(project_id: int | None = None, db: Session = Depends(get_db)):
    def count(model, extra_filter=None):
        q = db.query(model)
        if project_id and hasattr(model, "project_id"):
            q = q.filter(model.project_id == project_id)
        if extra_filter:
            q = q.filter(extra_filter)
        return q.count()

    return {
        "projects": count(Project),
        "scenarios": count(Scenario),
        "requirements": count(Requirement),
        "open_gaps": db.query(Requirement)
        .filter(Requirement.classification.in_(["Gap", "Partial Fit"]))
        .count(),
        "wricef_items": count(WricefItem),
        "config_items": count(ConfigItem),
        "test_cases": count(TestManagement),
    }
