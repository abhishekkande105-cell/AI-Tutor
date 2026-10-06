import datetime
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models import TutorSession, Message, Topic, Progress, Attempt, User
from app.api.auth import get_current_user
from app.services.socratic_tutor import socratic_tutor

router = APIRouter(prefix="/tutor", tags=["AI Socratic Tutor"])

class CreateSessionRequest(BaseModel):
    topic_id: Optional[int] = None
    title: Optional[str] = "Algebra — Linear Equations"
    difficulty: Optional[str] = "Medium"
    initial_question: Optional[str] = "Can you solve 2x + 5 = 15?"

class SendMessageRequest(BaseModel):
    session_id: int
    content: str

class RequestHintRequest(BaseModel):
    session_id: int

@router.post("/session")
def create_session(
    req: CreateSessionRequest,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user)
):
    user_id = current_user.id if current_user else 1

    # Check topic
    topic = None
    if req.topic_id:
        topic = db.query(Topic).filter(Topic.id == req.topic_id).first()
    if not topic:
        topic = db.query(Topic).first()

    session = TutorSession(
        user_id=user_id,
        topic_id=topic.id if topic else 1,
        title=topic.name if topic else req.title,
        difficulty=req.difficulty or (topic.difficulty if topic else "Medium"),
        status="ACTIVE",
        current_step=1,
        total_steps=3,
        hints_used=0,
        started_at=datetime.datetime.utcnow()
    )
    db.add(session)
    db.commit()
    db.refresh(session)

    # Initial Welcome message from Socratic Teacher
    welcome_content = (
        "👩‍🏫 **SocraticAI Tutor**\n*Your Personal Learning Guide*\n\n"
        "Hi! I'm here to help you understand the problem. I won't give you the answer right away — I'll help you discover it.\n\n"
        f"We're exploring **{topic.name if topic else 'Linear Equations'}**.\n"
        "What problem would you like to solve, or shall we start with a classic example?"
    )
    welcome_msg = Message(
        session_id=session.id,
        sender="AI",
        content=welcome_content,
        feedback_type="GUIDANCE"
    )
    db.add(welcome_msg)
    db.commit()

    return {
        "session_id": session.id,
        "title": session.title,
        "difficulty": session.difficulty,
        "status": session.status,
        "current_step": session.current_step,
        "total_steps": session.total_steps,
        "hints_used": session.hints_used,
        "topic": {
            "id": topic.id if topic else 1,
            "name": topic.name if topic else "Algebra — Linear Equations",
            "subject_name": topic.subject.name if topic and topic.subject else "Mathematics"
        },
        "messages": [{
            "id": welcome_msg.id,
            "sender": welcome_msg.sender,
            "content": welcome_msg.content,
            "feedback_type": welcome_msg.feedback_type,
            "created_at": welcome_msg.created_at.isoformat()
        }]
    }

@router.post("/message")
async def send_message(
    req: SendMessageRequest,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user)
):
    session = db.query(TutorSession).filter(TutorSession.id == req.session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Tutoring session not found.")

    # 1. Save student message
    student_msg = Message(
        session_id=session.id,
        sender="STUDENT",
        content=req.content,
        feedback_type="NORMAL"
    )
    db.add(student_msg)
    db.commit()

    # 2. Prepare conversation history
    past_messages = db.query(Message).filter(Message.session_id == session.id).order_by(Message.id.asc()).all()
    history = [{"sender": m.sender, "content": m.content} for m in past_messages]

    topic_name = session.topic.name if session.topic else session.title

    # 3. Generate teacher guidance response
    ai_result = await socratic_tutor.generate_response(
        conversation_history=history,
        user_message=req.content,
        topic_name=topic_name,
        current_step=session.current_step,
        hints_used=session.hints_used
    )

    # 4. Save AI response
    ai_msg = Message(
        session_id=session.id,
        sender="AI",
        content=ai_result["content"],
        feedback_type=ai_result["feedback_type"]
    )
    db.add(ai_msg)

    # 5. Update session step and status
    session.current_step = ai_result.get("next_step", session.current_step)
    if ai_result.get("is_completed"):
        session.status = "COMPLETED"
        session.completed_at = datetime.datetime.utcnow()

        # Record completed attempt & update progress
        attempt = Attempt(
            user_id=session.user_id,
            question_id=None,
            is_correct=True,
            hints_used=session.hints_used,
            attempts_count=1,
            completed_at=datetime.datetime.utcnow()
        )
        db.add(attempt)

        # Update topic progress score
        if session.topic_id:
            prog = db.query(Progress).filter(
                Progress.user_id == session.user_id,
                Progress.topic_id == session.topic_id
            ).first()
            if prog:
                prog.questions_completed += 1
                prog.mastery_score = min(100.0, prog.mastery_score + 4.0)
                prog.last_studied_at = datetime.datetime.utcnow()
            else:
                prog = Progress(
                    user_id=session.user_id,
                    topic_id=session.topic_id,
                    mastery_score=75.0,
                    questions_completed=1,
                    accuracy_pct=85.0
                )
                db.add(prog)

    db.commit()
    db.refresh(ai_msg)

    return {
        "id": ai_msg.id,
        "sender": ai_msg.sender,
        "content": ai_msg.content,
        "feedback_type": ai_msg.feedback_type,
        "current_step": session.current_step,
        "total_steps": session.total_steps,
        "status": session.status,
        "is_completed": ai_result.get("is_completed", False),
        "source": ai_result.get("source", "Socratic Teacher"),
        "created_at": ai_msg.created_at.isoformat()
    }

@router.post("/hint")
def request_hint(
    req: RequestHintRequest,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user)
):
    session = db.query(TutorSession).filter(TutorSession.id == req.session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found.")

    next_hint_num = min(session.hints_used + 1, 3)
    session.hints_used = next_hint_num
    
    topic_name = session.topic.name if session.topic else session.title
    hint_data = socratic_tutor.generate_hint(next_hint_num, topic_name)

    hint_text = f"💡 **{hint_data['title']}**\n\n{hint_data['content']}"

    hint_msg = Message(
        session_id=session.id,
        sender="AI",
        content=hint_text,
        feedback_type="HINT",
        hint_step=next_hint_num
    )
    db.add(hint_msg)
    db.commit()
    db.refresh(hint_msg)

    return {
        "hint_step": next_hint_num,
        "max_hints": 3,
        "title": hint_data["title"],
        "content": hint_data["content"],
        "message": {
            "id": hint_msg.id,
            "sender": hint_msg.sender,
            "content": hint_msg.content,
            "feedback_type": hint_msg.feedback_type,
            "hint_step": next_hint_num,
            "created_at": hint_msg.created_at.isoformat()
        }
    }

@router.get("/session/{session_id}")
def get_session(session_id: int, db: Session = Depends(get_db)):
    session = db.query(TutorSession).filter(TutorSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    messages = db.query(Message).filter(Message.session_id == session.id).order_by(Message.id.asc()).all()
    
    return {
        "session_id": session.id,
        "title": session.title,
        "difficulty": session.difficulty,
        "status": session.status,
        "current_step": session.current_step,
        "total_steps": session.total_steps,
        "hints_used": session.hints_used,
        "topic": {
            "id": session.topic.id if session.topic else 1,
            "name": session.topic.name if session.topic else session.title,
            "subject_name": session.topic.subject.name if session.topic and session.topic.subject else "Mathematics"
        },
        "messages": [{
            "id": m.id,
            "sender": m.sender,
            "content": m.content,
            "feedback_type": m.feedback_type,
            "hint_step": m.hint_step,
            "created_at": m.created_at.isoformat()
        } for m in messages]
    }

@router.get("/sessions")
def list_sessions(db: Session = Depends(get_db), current_user: Optional[User] = Depends(get_current_user)):
    user_id = current_user.id if current_user else 1
    sessions = db.query(TutorSession).filter(TutorSession.user_id == user_id).order_by(TutorSession.started_at.desc()).limit(10).all()
    return [{
        "id": s.id,
        "title": s.title,
        "difficulty": s.difficulty,
        "status": s.status,
        "hints_used": s.hints_used,
        "started_at": s.started_at.isoformat()
    } for s in sessions]
