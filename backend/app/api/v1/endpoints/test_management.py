from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ....core.database import get_db
from ....models.test_management import TestManagement
from ....schemas.test_management import TestManagementCreate, TestManagementUpdate, TestManagementResponse
from ._crud_helper import list_items, get_item, create_item, update_item, delete_item

router = APIRouter(prefix="/tests", tags=["Test Management"])


@router.get("", response_model=list[TestManagementResponse])
def get_tests(
    project_id: int | None = None,
    test_type: str | None = None,
    db: Session = Depends(get_db),
):
    return list_items(db, TestManagement, {"project_id": project_id, "test_type": test_type})


@router.post("", response_model=TestManagementResponse, status_code=201)
def create_test(data: TestManagementCreate, db: Session = Depends(get_db)):
    return create_item(db, TestManagement, data)


@router.get("/{item_id}", response_model=TestManagementResponse)
def get_test(item_id: int, db: Session = Depends(get_db)):
    return get_item(db, TestManagement, item_id)


@router.put("/{item_id}", response_model=TestManagementResponse)
def update_test(item_id: int, data: TestManagementUpdate, db: Session = Depends(get_db)):
    return update_item(db, TestManagement, item_id, data)


@router.delete("/{item_id}")
def delete_test(item_id: int, db: Session = Depends(get_db)):
    return delete_item(db, TestManagement, item_id)
