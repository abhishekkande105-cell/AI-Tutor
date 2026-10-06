import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text, Float
from sqlalchemy.orm import relationship
from app.db.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    full_name = Column(String(255), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(50), default="STUDENT", nullable=False) # STUDENT, TEACHER, ADMIN
    avatar = Column(String(255), nullable=True)
    streak_days = Column(Integer, default=1)
    grade_level = Column(String(100), default="High School / College")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    sessions = relationship("TutorSession", back_populates="user", cascade="all, delete-orphan")
    attempts = relationship("Attempt", back_populates="user", cascade="all, delete-orphan")
    progress_records = relationship("Progress", back_populates="user", cascade="all, delete-orphan")

class Subject(Base):
    __tablename__ = "subjects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    code = Column(String(50), unique=True, nullable=False)
    description = Column(Text, nullable=True)
    icon = Column(String(50), default="BookOpen")
    color = Column(String(50), default="#2563eb") # Primary theme hex
    
    topics = relationship("Topic", back_populates="subject", cascade="all, delete-orphan")

class Topic(Base):
    __tablename__ = "topics"

    id = Column(Integer, primary_key=True, index=True)
    subject_id = Column(Integer, ForeignKey("subjects.id"), nullable=False)
    name = Column(String(150), nullable=False)
    description = Column(Text, nullable=True)
    difficulty = Column(String(50), default="Medium") # Easy, Medium, Hard
    order_index = Column(Integer, default=0)

    subject = relationship("Subject", back_populates="topics")
    questions = relationship("Question", back_populates="topic", cascade="all, delete-orphan")
    sessions = relationship("TutorSession", back_populates="topic")
    mistakes = relationship("CommonMistakeLog", back_populates="topic")

class TutorSession(Base):
    __tablename__ = "tutor_sessions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    topic_id = Column(Integer, ForeignKey("topics.id"), nullable=True)
    title = Column(String(255), default="Algebra Problem Solving")
    difficulty = Column(String(50), default="Medium")
    status = Column(String(50), default="ACTIVE") # ACTIVE, COMPLETED
    current_step = Column(Integer, default=1)
    total_steps = Column(Integer, default=3)
    hints_used = Column(Integer, default=0)
    started_at = Column(DateTime, default=datetime.datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)

    user = relationship("User", back_populates="sessions")
    topic = relationship("Topic", back_populates="sessions")
    messages = relationship("Message", back_populates="session", cascade="all, delete-orphan")

class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("tutor_sessions.id"), nullable=False)
    sender = Column(String(50), nullable=False) # STUDENT, AI, SYSTEM
    content = Column(Text, nullable=False)
    feedback_type = Column(String(50), default="NORMAL") # NORMAL, CORRECT, GUIDANCE, CHECK_STEP, SOLVED, HINT
    hint_step = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    session = relationship("TutorSession", back_populates="messages")

class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    topic_id = Column(Integer, ForeignKey("topics.id"), nullable=False)
    prompt = Column(Text, nullable=False)
    difficulty = Column(String(50), default="Medium")
    target_concept = Column(String(255), nullable=False)
    hint_1 = Column(Text, nullable=True)
    hint_2 = Column(Text, nullable=True)
    hint_3 = Column(Text, nullable=True)
    final_solution = Column(Text, nullable=False)

    topic = relationship("Topic", back_populates="questions")
    attempts = relationship("Attempt", back_populates="question")

class Attempt(Base):
    __tablename__ = "attempts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    question_id = Column(Integer, ForeignKey("questions.id"), nullable=True)
    is_correct = Column(Boolean, default=True)
    hints_used = Column(Integer, default=0)
    attempts_count = Column(Integer, default=1)
    common_mistake_tag = Column(String(100), nullable=True)
    completed_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="attempts")
    question = relationship("Question", back_populates="attempts")

class Progress(Base):
    __tablename__ = "progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    topic_id = Column(Integer, ForeignKey("topics.id"), nullable=False)
    mastery_score = Column(Float, default=0.0) # 0 to 100
    questions_completed = Column(Integer, default=0)
    accuracy_pct = Column(Float, default=0.0)
    last_studied_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="progress_records")
    topic = relationship("Topic")

class CommonMistakeLog(Base):
    __tablename__ = "common_mistakes"

    id = Column(Integer, primary_key=True, index=True)
    topic_id = Column(Integer, ForeignKey("topics.id"), nullable=False)
    category = Column(String(150), nullable=False) # e.g. "Sign errors", "Incorrect equation transformation"
    percentage = Column(Integer, default=20)
    description = Column(Text, nullable=False)
    remediation_tip = Column(Text, nullable=True)

    topic = relationship("Topic", back_populates="mistakes")
