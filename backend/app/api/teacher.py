from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Optional
from app.db.database import get_db
from app.db.models import User, Progress, CommonMistakeLog, Attempt, Topic
from app.api.auth import get_current_user

router = APIRouter(prefix="/teacher", tags=["Teacher Dashboard & Analytics"])

@router.get("/dashboard")
def get_teacher_dashboard(db: Session = Depends(get_db)):
    return {
        "title": "Teacher Dashboard",
        "subtitle": "Monitor learning. Understand students. Improve outcomes.",
        "metrics": {
            "total_students": 128,
            "active_today": 84,
            "average_accuracy": 76,
            "questions_attempted": 2431
        },
        "topic_performance": [
            {"topic": "Algebra — Linear Eq.", "avg_accuracy": 82, "students_count": 94, "status": "Strong"},
            {"topic": "Newton's Laws of Motion", "avg_accuracy": 64, "students_count": 88, "status": "Needs Attention"},
            {"topic": "Chemical Balancing", "avg_accuracy": 79, "students_count": 76, "status": "Good"},
            {"topic": "Python Iteration", "avg_accuracy": 85, "students_count": 62, "status": "Strong"},
            {"topic": "Calculus & Derivatives", "avg_accuracy": 54, "students_count": 45, "status": "Critical Intervention"},
        ]
    }

@router.get("/students")
def get_all_students(db: Session = Depends(get_db)):
    students = [
        {"id": 1, "name": "Alex Morgan", "email": "student@socratic.ai", "grade": "11th Grade", "streak": 7, "avg_accuracy": 84, "questions_done": 124, "status": "Thriving", "primary_subject": "Mathematics"},
        {"id": 2, "name": "Rahul Sharma", "email": "rahul@socratic.ai", "grade": "10th Grade", "streak": 2, "avg_accuracy": 42, "questions_done": 38, "status": "Needs Support", "primary_subject": "Algebra"},
        {"id": 3, "name": "Priya Nair", "email": "priya@socratic.ai", "grade": "11th Grade", "streak": 3, "avg_accuracy": 48, "questions_done": 45, "status": "Needs Support", "primary_subject": "Calculus"},
        {"id": 4, "name": "Aman Gupta", "email": "aman@socratic.ai", "grade": "11th Grade", "streak": 4, "avg_accuracy": 51, "questions_done": 52, "status": "Needs Support", "primary_subject": "Physics"},
        {"id": 5, "name": "Maya Patel", "email": "maya@socratic.ai", "grade": "12th Grade", "streak": 9, "avg_accuracy": 88, "questions_done": 142, "status": "Thriving", "primary_subject": "Chemistry"},
        {"id": 6, "name": "Kevin Chen", "email": "kevin@socratic.ai", "grade": "10th Grade", "streak": 6, "avg_accuracy": 78, "questions_done": 95, "status": "On Track", "primary_subject": "Algebra"},
        {"id": 7, "name": "Sophia Rodriguez", "email": "sophia@socratic.ai", "grade": "11th Grade", "streak": 12, "avg_accuracy": 92, "questions_done": 160, "status": "Thriving", "primary_subject": "Computer Science"},
        {"id": 8, "name": "Liam Davies", "email": "liam@socratic.ai", "grade": "12th Grade", "streak": 5, "avg_accuracy": 67, "questions_done": 78, "status": "On Track", "primary_subject": "Physics"},
    ]
    return students

@router.get("/students-needing-support")
def get_students_needing_support(db: Session = Depends(get_db)):
    """
    Dedicated teacher feature: Students who may need additional guidance.
    Rahul (Algebra, 42%), Priya (Calculus, 48%), Aman (Physics, 51%)
    """
    return [
        {
            "id": 2,
            "name": "Rahul",
            "subject": "Algebra",
            "topic": "Linear & Two-Step Equations",
            "accuracy": 42,
            "struggle_area": "Sign flip during transposition (34% error rate)",
            "recent_attempts": 14,
            "recommended_action": "Schedule 10-minute 1-on-1 Socratic session on inverse operations.",
            "avatar": "https://api.dicebear.com/7.x/bottts/svg?seed=Rahul"
        },
        {
            "id": 3,
            "name": "Priya",
            "subject": "Calculus",
            "topic": "Derivative Chain Rule",
            "accuracy": 48,
            "struggle_area": "Omitting inner derivative multiplication",
            "recent_attempts": 19,
            "recommended_action": "Assign conceptual scaffolded practice on composite functions.",
            "avatar": "https://api.dicebear.com/7.x/bottts/svg?seed=Priya"
        },
        {
            "id": 4,
            "name": "Aman",
            "subject": "Physics",
            "topic": "Newton's Laws & Force Vectors",
            "accuracy": 51,
            "struggle_area": "Neglecting opposite directional signs in net force sum",
            "recent_attempts": 16,
            "recommended_action": "Review Free-Body Diagram vector mapping exercise.",
            "avatar": "https://api.dicebear.com/7.x/bottts/svg?seed=Aman"
        }
    ]

@router.get("/common-mistakes")
def get_common_mistakes(db: Session = Depends(get_db)):
    """
    Identifies systemic patterns across tutoring attempts.
    Common Algebra Mistakes:
    1. Sign errors — 34%
    2. Incorrect equation transformation — 27%
    3. Calculation errors — 18%
    """
    mistakes = db.query(CommonMistakeLog).order_by(CommonMistakeLog.percentage.desc()).all()
    if not mistakes:
        return [
            {"id": 1, "topic": "Algebra", "category": "Sign errors", "percentage": 34, "description": "Flipping signs inconsistently when moving terms across the equals sign.", "tip": "Prompt students: 'What happens to the +5 when we apply the inverse operation?'"},
            {"id": 2, "topic": "Algebra", "category": "Incorrect equation transformation", "percentage": 27, "description": "Applying operations to only one side of the equation.", "tip": "Reinforce: 'Whatever you do to one side, you must do to the other side.'"},
            {"id": 3, "topic": "Algebra", "category": "Calculation errors", "percentage": 18, "description": "Basic arithmetic slips during final division or addition.", "tip": "Prompt students to verify their steps with inverse checks."},
            {"id": 4, "topic": "Physics", "category": "Missing vector direction", "percentage": 31, "description": "Treating force and velocity purely as positive scalars.", "tip": "Ask: 'Which direction does friction oppose the motion?'"},
            {"id": 5, "topic": "Physics", "category": "Unit conversion omission", "percentage": 29, "description": "Failing to convert grams to kilograms before calculating F = ma.", "tip": "Highlight SI base units check."},
        ]

    return [{
        "id": m.id,
        "topic": m.topic.name if m.topic else "General",
        "category": m.category,
        "percentage": m.percentage,
        "description": m.description,
        "tip": m.remediation_tip
    } for m in mistakes]
