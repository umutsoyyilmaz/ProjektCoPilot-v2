from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ....core.database import get_db
from ....models.requirement import Requirement
from ....models.wricef_item import WricefItem
from ....models.config_item import ConfigItem
from ....schemas.requirement import RequirementCreate, RequirementUpdate, RequirementResponse
from ._crud_helper import list_items, get_item, create_item, update_item, delete_item

router = APIRouter(prefix="/requirements", tags=["Requirements"])


@router.get("", response_model=list[RequirementResponse])
def get_requirements(
    project_id: int | None = None,
    session_id: int | None = None,
    classification: str | None = None,
    db: Session = Depends(get_db),
):
    return list_items(db, Requirement, {
        "project_id": project_id,
        "session_id": session_id,
        "classification": classification,
    })


@router.post("", response_model=RequirementResponse, status_code=201)
def create_requirement(data: RequirementCreate, db: Session = Depends(get_db)):
    return create_item(db, Requirement, data)


@router.get("/{item_id}", response_model=RequirementResponse)
def get_requirement(item_id: int, db: Session = Depends(get_db)):
    return get_item(db, Requirement, item_id)


@router.put("/{item_id}", response_model=RequirementResponse)
def update_requirement(item_id: int, data: RequirementUpdate, db: Session = Depends(get_db)):
    return update_item(db, Requirement, item_id, data)


@router.delete("/{item_id}")
def delete_requirement(item_id: int, db: Session = Depends(get_db)):
    return delete_item(db, Requirement, item_id)


@router.post("/{item_id}/convert")
def convert_requirement(item_id: int, db: Session = Depends(get_db)):
    req = get_item(db, Requirement, item_id)

    if req.conversion_status == "converted":
        raise HTTPException(status_code=400, detail="Already converted")

    classification = (req.classification or "").strip()
    now = datetime.now().isoformat()

    if classification == "Fit":
        item = ConfigItem(
            title=req.title,
            config_type=req.module or "standard",
            description=req.description,
            status="planned",
            project_id=req.project_id,
            requirement_id=req.id,
            created_at=now,
        )
        db.add(item)
        db.commit()
        db.refresh(item)
        conversion_type = "config"
        created_id = item.id
    elif classification in ("Gap", "Partial Fit"):
        item = WricefItem(
            title=req.title,
            wricef_type="E",
            description=req.description,
            status="identified",
            priority=req.priority,
            project_id=req.project_id,
            requirement_id=req.id,
            created_at=now,
        )
        db.add(item)
        db.commit()
        db.refresh(item)
        conversion_type = "wricef"
        created_id = item.id
    else:
        raise HTTPException(status_code=400, detail=f"Invalid classification: {classification}")

    req.conversion_status = "converted"
    req.conversion_type = conversion_type
    req.conversion_id = created_id
    req.converted_at = now
    db.commit()

    return {
        "message": "Converted successfully",
        "conversion_type": conversion_type,
        "created_item_id": created_id,
    }
