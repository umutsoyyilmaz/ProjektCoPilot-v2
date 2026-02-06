from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ....core.database import get_db
from ....models.analysis import Analysis
from ....schemas.analysis import AnalysisCreate, AnalysisUpdate, AnalysisResponse
from ._crud_helper import list_items, get_item, create_item, update_item, delete_item

router = APIRouter(prefix="/analyses", tags=["Analyses"])


@router.get("", response_model=list[AnalysisResponse])
def get_analyses(scenario_id: int | None = None, db: Session = Depends(get_db)):
    return list_items(db, Analysis, {"scenario_id": scenario_id})


@router.post("", response_model=AnalysisResponse, status_code=201)
def create_analysis(data: AnalysisCreate, db: Session = Depends(get_db)):
    return create_item(db, Analysis, data)


@router.get("/{item_id}", response_model=AnalysisResponse)
def get_analysis(item_id: int, db: Session = Depends(get_db)):
    return get_item(db, Analysis, item_id)


@router.put("/{item_id}", response_model=AnalysisResponse)
def update_analysis(item_id: int, data: AnalysisUpdate, db: Session = Depends(get_db)):
    return update_item(db, Analysis, item_id, data)


@router.delete("/{item_id}")
def delete_analysis(item_id: int, db: Session = Depends(get_db)):
    return delete_item(db, Analysis, item_id)
