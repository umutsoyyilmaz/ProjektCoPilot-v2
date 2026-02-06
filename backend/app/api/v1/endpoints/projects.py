from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ....core.database import get_db
from ....models.project import Project
from ....schemas.project import ProjectCreate, ProjectUpdate, ProjectResponse
from ._crud_helper import list_items, get_item, create_item, update_item, delete_item

router = APIRouter(prefix="/projects", tags=["Projects"])


@router.get("", response_model=list[ProjectResponse])
def get_projects(project_id: int | None = None, db: Session = Depends(get_db)):
    return list_items(db, Project, {"id": project_id} if project_id else None)


@router.post("", response_model=ProjectResponse, status_code=201)
def create_project(data: ProjectCreate, db: Session = Depends(get_db)):
    return create_item(db, Project, data)


@router.get("/{item_id}", response_model=ProjectResponse)
def get_project(item_id: int, db: Session = Depends(get_db)):
    return get_item(db, Project, item_id)


@router.put("/{item_id}", response_model=ProjectResponse)
def update_project(item_id: int, data: ProjectUpdate, db: Session = Depends(get_db)):
    return update_item(db, Project, item_id, data)


@router.delete("/{item_id}")
def delete_project(item_id: int, db: Session = Depends(get_db)):
    return delete_item(db, Project, item_id)
