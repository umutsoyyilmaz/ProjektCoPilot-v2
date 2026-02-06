from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ....core.database import get_db
from ....models.test_execution import TestExecution
from ....schemas.test_execution import TestExecutionCreate, TestExecutionUpdate, TestExecutionResponse
from ._crud_helper import list_items, get_item, create_item, update_item, delete_item

router = APIRouter(prefix="/test-executions", tags=["Test Executions"])


@router.get("", response_model=list[TestExecutionResponse])
def get_test_executions(test_cycle_id: int | None = None, db: Session = Depends(get_db)):
    return list_items(db, TestExecution, {"test_cycle_id": test_cycle_id})


@router.post("", response_model=TestExecutionResponse, status_code=201)
def create_test_execution(data: TestExecutionCreate, db: Session = Depends(get_db)):
    return create_item(db, TestExecution, data)


@router.get("/{item_id}", response_model=TestExecutionResponse)
def get_test_execution(item_id: int, db: Session = Depends(get_db)):
    return get_item(db, TestExecution, item_id)


@router.put("/{item_id}", response_model=TestExecutionResponse)
def update_test_execution(item_id: int, data: TestExecutionUpdate, db: Session = Depends(get_db)):
    return update_item(db, TestExecution, item_id, data)
