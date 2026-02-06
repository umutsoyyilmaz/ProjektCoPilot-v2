from pydantic import BaseModel, ConfigDict
from typing import Optional


class AttendeeBase(BaseModel):
    session_id: Optional[int] = None
    name: Optional[str] = None
    role: Optional[str] = None
    email: Optional[str] = None
    department: Optional[str] = None
    attendance_status: Optional[str] = None


class AttendeeCreate(AttendeeBase):
    pass


class AttendeeUpdate(BaseModel):
    name: Optional[str] = None
    role: Optional[str] = None
    email: Optional[str] = None
    department: Optional[str] = None
    attendance_status: Optional[str] = None


class AttendeeResponse(AttendeeBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
