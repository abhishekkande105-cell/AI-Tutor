from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import Optional
from app.db.database import get_db
from app.db.models import User, Progress, Attempt, TutorSession
from app.api.auth import get_current_user

router = APIRouter(prefix="/progress", tags=["Student Learning Progress"])

@router.get("")
def get_student_progress(db: Session = Depends(get_db), current_user: Optional[User] = Depends(get_current_user)):
    user_id = current_user.id if current_user else 1

    # Subject performance for bar charts
    subject_performance = [
        {"subject": "Mathematics", "score": 72, "target": 90, "color": "#2563eb"},
        {"subject": "Physics", "score": 54, "target": 85, "color": "#0284c7"},
        {"subject": "Chemistry", "score": 81, "target": 90, "color": "#10b981"},
        {"subject": "Computer Science", "score": 67, "target": 85, "color": "#6366f1"},
        {"subject": "General Science", "score": 60, "target": 80, "color": "#f59e0b"},
    ]

    # Topic strength (radar / comparative)
    topic_strength = [
        {"topic": "Linear Equations", "mastery": 88, "benchmark": 75},
        {"topic": "Quadratic Eq.", "mastery": 62, "benchmark": 70},
        {"topic": "Newton's Laws", "mastery": 58, "benchmark": 65},
        {"topic": "Stoichiometry", "mastery": 84, "benchmark": 72},
        {"topic": "Python Loops", "mastery": 79, "benchmark": 68},
        {"topic": "Kinematics", "mastery": 50, "benchmark": 60},
    ]

    # Weekly learning activity (questions & minutes)
    weekly_activity = [
        {"day": "Mon", "questions": 18, "minutes": 45},
        {"day": "Tue", "questions": 24, "minutes": 60},
        {"day": "Wed", "questions": 15, "minutes": 35},
        {"day": "Thu", "questions": 22, "minutes": 55},
        {"day": "Fri", "questions": 28, "minutes": 70},
        {"day": "Sat", "questions": 10, "minutes": 25},
        {"day": "Sun", "questions": 7, "minutes": 20},
    ]

    return {
        "overall_progress": 78,
        "questions_completed": 124,
        "accuracy_pct": 84,
        "learning_streak_days": 7,
        "hints_used": 36,
        "learning_time": "12h 42m",
        "subject_performance": subject_performance,
        "topic_strength": topic_strength,
        "weekly_activity": weekly_activity,
        "recommendation": "Great consistency! Recommended next focus: Review Newton's Laws vector directions to boost Physics mastery."
    }

@router.get("/history")
def get_learning_history(db: Session = Depends(get_db), current_user: Optional[User] = Depends(get_current_user)):
    user_id = current_user.id if current_user else 1

    timeline_items = [
        {
            "id": 1,
            "period": "Today",
            "date_display": "Today at 2:15 PM",
            "subject": "Mathematics",
            "topic": "Algebra — Linear Equations",
            "problem": "Solve 2x + 5 = 15",
            "score": "100%",
            "hints_used": 1,
            "time_spent": "12 mins",
            "status": "COMPLETED",
            "outcome": "Solved Independently",
            "badge_color": "emerald"
        },
        {
            "id": 2,
            "period": "Yesterday",
            "date_display": "Yesterday at 4:30 PM",
            "subject": "Physics",
            "topic": "Newton's Laws of Motion",
            "problem": "Calculate acceleration given 20N net force and 5kg mass",
            "score": "88%",
            "hints_used": 2,
            "time_spent": "22 mins",
            "status": "COMPLETED",
            "outcome": "Mastered with Guiding Hints",
            "badge_color": "blue"
        },
        {
            "id": 3,
            "period": "2 days ago",
            "date_display": "2 days ago at 11:00 AM",
            "subject": "Computer Science",
            "topic": "Loops & Iteration in Python",
            "problem": "Write for loop with range()",
            "score": "100%",
            "hints_used": 0,
            "time_spent": "10 mins",
            "status": "COMPLETED",
            "outcome": "Flawless First-Attempt Solution",
            "badge_color": "indigo"
        },
        {
            "id": 4,
            "period": "3 days ago",
            "date_display": "3 days ago at 3:45 PM",
            "subject": "Chemistry",
            "topic": "Chemical Equations & Balancing",
            "problem": "Balance H₂ + O₂ → H₂O",
            "score": "92%",
            "hints_used": 1,
            "time_spent": "18 mins",
            "status": "COMPLETED",
            "outcome": "Stoichiometry Concept Discovered",
            "badge_color": "teal"
        }
    ]
    return timeline_items
