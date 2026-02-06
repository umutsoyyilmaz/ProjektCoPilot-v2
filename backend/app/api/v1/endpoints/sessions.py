from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session as DBSession
from ....core.database import get_db
from ....models.session import Session as SessionModel
from ....schemas.session import SessionCreate, SessionUpdate, SessionResponse
from ._crud_helper import list_items, get_item, create_item, update_item, delete_item

router = APIRouter(prefix="/sessions", tags=["Sessions"])


@router.get("", response_model=list[SessionResponse])
def get_sessions(
    project_id: int | None = None,
    analysis_id: int | None = None,
    db: DBSession = Depends(get_db),
):
    return list_items(db, SessionModel, {"project_id": project_id, "analysis_id": analysis_id})


@router.post("", response_model=SessionResponse, status_code=201)
def create_session(data: SessionCreate, db: DBSession = Depends(get_db)):
    return create_item(db, SessionModel, data)


@router.get("/{item_id}", response_model=SessionResponse)
def get_session(item_id: int, db: DBSession = Depends(get_db)):
    return get_item(db, SessionModel, item_id)


@router.put("/{item_id}", response_model=SessionResponse)
def update_session(item_id: int, data: SessionUpdate, db: DBSession = Depends(get_db)):
    return update_item(db, SessionModel, item_id, data)


@router.delete("/{item_id}")
def delete_session(item_id: int, db: DBSession = Depends(get_db)):
    return delete_item(db, SessionModel, item_id)
