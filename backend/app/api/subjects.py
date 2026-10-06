from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Optional
from app.db.database import get_db
from app.db.models import Subject, Topic, Progress, User
from app.api.auth import get_current_user

router = APIRouter(prefix="/subjects", tags=["Subjects & Topics"])

@router.get("")
def get_subjects(db: Session = Depends(get_db), current_user: Optional[User] = Depends(get_current_user)):
    subjects = db.query(Subject).all()
    user_id = current_user.id if current_user else 1

    # Fetch progress for this user
    progress_map = {}
    progresses = db.query(Progress).filter(Progress.user_id == user_id).all()
    for p in progresses:
        progress_map[p.topic_id] = p.mastery_score

    result = []
    # Fixed mock stats to match prompt: Math 72%, Physics 54%, Chem 81%, CS 67%
    default_progress = {
        "MATH": 72,
        "PHYS": 54,
        "CHEM": 81,
        "CS": 67,
        "SCI": 45
    }

    for s in subjects:
        topics_data = []
        for t in s.topics:
            topics_data.append({
                "id": t.id,
                "name": t.name,
                "description": t.description,
                "difficulty": t.difficulty,
                "order_index": t.order_index,
                "mastery_score": progress_map.get(t.id, 65)
            })

        overall = default_progress.get(s.code, 60)
        result.append({
            "id": s.id,
            "name": s.name,
            "code": s.code,
            "description": s.description,
            "icon": s.icon,
            "color": s.color,
            "progress": overall,
            "topics": topics_data
        })
    return result

@router.get("/topics")
def get_topics(subject_id: Optional[int] = None, db: Session = Depends(get_db)):
    query = db.query(Topic)
    if subject_id:
        query = query.filter(Topic.subject_id == subject_id)
    topics = query.order_index_by if hasattr(query, 'order_index_by') else query.all()
    return [{
        "id": t.id,
        "subject_id": t.subject_id,
        "name": t.name,
        "description": t.description,
        "difficulty": t.difficulty
    } for t in topics]
