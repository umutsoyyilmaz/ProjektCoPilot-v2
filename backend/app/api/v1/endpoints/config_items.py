from datetime import datetime
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ....core.database import get_db
from ....models.config_item import ConfigItem
from ....models.test_management import TestManagement
from ....schemas.config_item import ConfigItemCreate, ConfigItemUpdate, ConfigItemResponse
from ._crud_helper import list_items, get_item, create_item, update_item, delete_item

router = APIRouter(prefix="/config-items", tags=["Config Items"])


@router.get("", response_model=list[ConfigItemResponse])
def get_config_items(project_id: int | None = None, db: Session = Depends(get_db)):
    return list_items(db, ConfigItem, {"project_id": project_id})


@router.post("", response_model=ConfigItemResponse, status_code=201)
def create_config_item(data: ConfigItemCreate, db: Session = Depends(get_db)):
    return create_item(db, ConfigItem, data)


@router.get("/{item_id}", response_model=ConfigItemResponse)
def get_config_item(item_id: int, db: Session = Depends(get_db)):
    return get_item(db, ConfigItem, item_id)


@router.put("/{item_id}", response_model=ConfigItemResponse)
def update_config_item(item_id: int, data: ConfigItemUpdate, db: Session = Depends(get_db)):
    return update_item(db, ConfigItem, item_id, data)


@router.delete("/{item_id}")
def delete_config_item(item_id: int, db: Session = Depends(get_db)):
    return delete_item(db, ConfigItem, item_id)


@router.post("/{item_id}/convert-to-test")
def convert_config_to_test(item_id: int, db: Session = Depends(get_db)):
    item = get_item(db, ConfigItem, item_id)
    now = datetime.now().isoformat()
    test = TestManagement(
        title=f"Unit Test: {item.title}",
        test_type="unit",
        source_type="config",
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
