"""Generic CRUD helper to reduce boilerplate across endpoints."""
from datetime import datetime
from typing import Any, Type

from fastapi import HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from ....core.database import Base


def list_items(
    db: Session,
    model: Type[Base],
    filters: dict[str, Any] | None = None,
) -> list:
    q = db.query(model)
    if filters:
        for key, val in filters.items():
            if val is not None and hasattr(model, key):
                q = q.filter(getattr(model, key) == val)
    return q.all()


def get_item(db: Session, model: Type[Base], item_id: int):
    item = db.query(model).filter(model.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail=f"{model.__name__} not found")
    return item


def create_item(
    db: Session,
    model: Type[Base],
    data: BaseModel,
    extra: dict[str, Any] | None = None,
):
    values = data.model_dump(exclude_unset=True)
    if extra:
        values.update(extra)
    if hasattr(model, "created_at") and "created_at" not in values:
        values["created_at"] = datetime.now().isoformat()
    obj = model(**values)
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


def update_item(
    db: Session,
    model: Type[Base],
    item_id: int,
    data: BaseModel,
):
    obj = get_item(db, model, item_id)
    values = data.model_dump(exclude_unset=True)
    if hasattr(model, "updated_at"):
        values["updated_at"] = datetime.now().isoformat()
    for key, val in values.items():
        if hasattr(obj, key):
            setattr(obj, key, val)
    db.commit()
    db.refresh(obj)
    return obj


def delete_item(db: Session, model: Type[Base], item_id: int):
    obj = get_item(db, model, item_id)
    db.delete(obj)
    db.commit()
    return {"message": f"{model.__name__} {item_id} deleted"}
