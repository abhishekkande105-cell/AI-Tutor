from fastapi import APIRouter
from app.services.socratic_tutor import socratic_tutor

router = APIRouter(tags=["System Status"])

@router.get("/status")
def get_system_status():
    return socratic_tutor.get_status_info()
