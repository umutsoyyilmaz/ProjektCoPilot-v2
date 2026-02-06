from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ....core.database import get_db
from ....models.scenario import Scenario
from ....schemas.scenario import ScenarioCreate, ScenarioUpdate, ScenarioResponse
from ._crud_helper import list_items, get_item, create_item, update_item, delete_item

router = APIRouter(prefix="/scenarios", tags=["Scenarios"])


@router.get("", response_model=list[ScenarioResponse])
def get_scenarios(project_id: int | None = None, db: Session = Depends(get_db)):
    return list_items(db, Scenario, {"project_id": project_id})


@router.post("", response_model=ScenarioResponse, status_code=201)
def create_scenario(data: ScenarioCreate, db: Session = Depends(get_db)):
    return create_item(db, Scenario, data)


@router.get("/{item_id}", response_model=ScenarioResponse)
def get_scenario(item_id: int, db: Session = Depends(get_db)):
    return get_item(db, Scenario, item_id)


@router.put("/{item_id}", response_model=ScenarioResponse)
def update_scenario(item_id: int, data: ScenarioUpdate, db: Session = Depends(get_db)):
    return update_item(db, Scenario, item_id, data)


@router.delete("/{item_id}")
def delete_scenario(item_id: int, db: Session = Depends(get_db)):
    return delete_item(db, Scenario, item_id)
