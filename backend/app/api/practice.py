from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models import Question, Topic, Subject, User, Attempt
from app.api.auth import get_current_user

router = APIRouter(prefix="/practice", tags=["Practice Mode"])

class SubmitAnswerRequest(BaseModel):
    question_id: int
    user_answer: str

@router.get("/questions")
def get_practice_questions(
    subject_id: Optional[int] = None,
    topic_id: Optional[int] = None,
    difficulty: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Question)
    if topic_id:
        query = query.filter(Question.topic_id == topic_id)
    if difficulty:
        query = query.filter(Question.difficulty == difficulty)
    questions = query.limit(10).all()

    return [{
        "id": q.id,
        "topic_id": q.topic_id,
        "topic_name": q.topic.name if q.topic else "General Practice",
        "subject_name": q.topic.subject.name if q.topic and q.topic.subject else "General",
        "prompt": q.prompt,
        "difficulty": q.difficulty,
        "target_concept": q.target_concept,
        "hints": [q.hint_1, q.hint_2, q.hint_3]
    } for q in questions]

@router.post("/submit")
def submit_practice_answer(
    req: SubmitAnswerRequest,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user)
):
    user_id = current_user.id if current_user else 1
    question = db.query(Question).filter(Question.id == req.question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")

    # Simple normalization check
    norm_user = req.user_answer.strip().lower().replace(" ", "")
    norm_sol = question.final_solution.strip().lower().replace(" ", "")

    is_correct = norm_user == norm_sol or norm_user in norm_sol or (question.final_solution.split("=")[-1].strip().lower() in norm_user)

    attempt = Attempt(
        user_id=user_id,
        question_id=question.id,
        is_correct=is_correct,
        hints_used=0,
        attempts_count=1
    )
    db.add(attempt)
    db.commit()

    if is_correct:
        return {
            "is_correct": True,
            "feedback": "🌟 Great job! You solved it yourself.",
            "explanation": f"The correct result is {question.final_solution}. Target concept mastered: {question.target_concept}."
        }
    else:
        return {
            "is_correct": False,
            "feedback": "🔎 Good attempt! Let's check that step again.",
            "explanation": f"Review the rule for {question.target_concept}. Would you like a hint?"
        }
