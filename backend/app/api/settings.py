from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
from sqlalchemy.orm import Session
from app.db.database import get_db, Base, engine, SessionLocal
from app.db.seed import seed_database
from app.services.socratic_tutor import socratic_tutor
from app.core.config import settings

router = APIRouter(prefix="/settings", tags=["Application Settings"])

class AIConfigRequest(BaseModel):
    api_key: str

class PersonaConfigRequest(BaseModel):
    tutor_personality: Optional[str] = "Patient Mentor" # "Patient Mentor", "Rigorous Academic", "Socratic Coach"
    hint_ladder_depth: Optional[int] = 3

@router.get("/config")
def get_config():
    return {
        "status": socratic_tutor.get_status_info(),
        "tutor_personality": "Patient Mentor",
        "hint_ladder_depth": 3,
        "database_type": "SQLite (PostgreSQL ready)",
        "project_version": "1.0.0"
    }

@router.post("/ai-config")
def update_ai_config(req: AIConfigRequest):
    success = socratic_tutor.configure_api_key(req.api_key)
    return {
        "success": success,
        "status": socratic_tutor.get_status_info()
    }

@router.post("/reset-demo")
def reset_demo_database():
    try:
        # Re-seed database cleanly
        db = SessionLocal()
        seed_database(db)
        db.close()
        return {"success": True, "message": "Demo data refreshed successfully."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
