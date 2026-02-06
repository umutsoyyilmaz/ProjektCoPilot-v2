from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ....core.database import get_db
from ....models.test_cycle import TestCycle
from ....schemas.test_cycle import TestCycleCreate, TestCycleUpdate, TestCycleResponse
from ._crud_helper import list_items, get_item, create_item, update_item, delete_item

router = APIRouter(prefix="/test-cycles", tags=["Test Cycles"])


@router.get("", response_model=list[TestCycleResponse])
def get_test_cycles(project_id: int | None = None, db: Session = Depends(get_db)):
    return list_items(db, TestCycle, {"project_id": project_id})


@router.post("", response_model=TestCycleResponse, status_code=201)
def create_test_cycle(data: TestCycleCreate, db: Session = Depends(get_db)):
    return create_item(db, TestCycle, data)


@router.get("/{item_id}", response_model=TestCycleResponse)
def get_test_cycle(item_id: int, db: Session = Depends(get_db)):
    return get_item(db, TestCycle, item_id)


@router.put("/{item_id}", response_model=TestCycleResponse)
def update_test_cycle(item_id: int, data: TestCycleUpdate, db: Session = Depends(get_db)):
    return update_item(db, TestCycle, item_id, data)


@router.delete("/{item_id}")
def delete_test_cycle(item_id: int, db: Session = Depends(get_db)):
    return delete_item(db, TestCycle, item_id)
