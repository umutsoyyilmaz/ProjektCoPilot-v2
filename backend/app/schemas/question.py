from pydantic import BaseModel, ConfigDict
from typing import Optional


class QuestionBase(BaseModel):
    session_id: Optional[int] = None
    question_id: Optional[str] = None
    question_text: Optional[str] = None
    answer_text: Optional[str] = None
    status: Optional[str] = "open"
    priority: Optional[str] = None
    assigned_to: Optional[str] = None
    category: Optional[str] = None


class QuestionCreate(QuestionBase):
    pass


class QuestionUpdate(BaseModel):
    question_text: Optional[str] = None
    answer_text: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    assigned_to: Optional[str] = None
    category: Optional[str] = None


class QuestionResponse(QuestionBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    created_at: Optional[str] = None
