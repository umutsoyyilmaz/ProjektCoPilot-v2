from datetime import datetime
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ....core.database import get_db
from ....models.wricef_item import WricefItem
from ....models.test_management import TestManagement
from ....schemas.wricef_item import WricefItemCreate, WricefItemUpdate, WricefItemResponse
from ._crud_helper import list_items, get_item, create_item, update_item, delete_item

router = APIRouter(prefix="/wricef-items", tags=["WRICEF Items"])


@router.get("", response_model=list[WricefItemResponse])
def get_wricef_items(project_id: int | None = None, db: Session = Depends(get_db)):
    return list_items(db, WricefItem, {"project_id": project_id})


@router.post("", response_model=WricefItemResponse, status_code=201)
def create_wricef_item(data: WricefItemCreate, db: Session = Depends(get_db)):
    return create_item(db, WricefItem, data)


@router.get("/{item_id}", response_model=WricefItemResponse)
def get_wricef_item(item_id: int, db: Session = Depends(get_db)):
    return get_item(db, WricefItem, item_id)


@router.put("/{item_id}", response_model=WricefItemResponse)
def update_wricef_item(item_id: int, data: WricefItemUpdate, db: Session = Depends(get_db)):
    return update_item(db, WricefItem, item_id, data)


@router.delete("/{item_id}")
def delete_wricef_item(item_id: int, db: Session = Depends(get_db)):
    return delete_item(db, WricefItem, item_id)


@router.post("/{item_id}/convert-to-test")
def convert_wricef_to_test(item_id: int, db: Session = Depends(get_db)):
    item = get_item(db, WricefItem, item_id)
    now = datetime.now().isoformat()
    test = TestManagement(
        title=f"Unit Test: {item.title}",
        test_type="unit",
        source_type="wricef",
        source_id=item.id,
        project_id=item.project_id,
        status="not_started",
        steps=item.unit_test_steps,
        created_at=now,
    )
    db.add(test)
    db.commit()
    db.refresh(test)
    return {"message": "Test case created", "test_id": test.id}
