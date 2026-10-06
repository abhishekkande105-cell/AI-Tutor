from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel, EmailStr
from typing import Optional
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models import User
from app.core.security import verify_password, hash_password, create_access_token, decode_access_token

router = APIRouter(prefix="/auth", tags=["Authentication"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login", auto_error=False)

class RegisterRequest(BaseModel):
    email: EmailStr
    full_name: str
    password: str
    role: Optional[str] = "STUDENT"
    grade_level: Optional[str] = "High School / College"

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class DemoLoginRequest(BaseModel):
    role: str = "STUDENT" # STUDENT, TEACHER, ADMIN

class UserResponse(BaseModel):
    id: int
    email: str
    full_name: str
    role: str
    avatar: Optional[str]
    streak_days: int
    grade_level: Optional[str]

def get_current_user(token: Optional[str] = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> Optional[User]:
    if not token:
        # Default to student demo user for seamless test experience if no token provided
        student = db.query(User).filter(User.role == "STUDENT").first()
        return student
    payload = decode_access_token(token)
    if not payload or "sub" not in payload:
        student = db.query(User).filter(User.role == "STUDENT").first()
        return student
    user_id = int(payload["sub"])
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        student = db.query(User).filter(User.role == "STUDENT").first()
        return student
    return user

@router.post("/register")
def register(req: RegisterRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == req.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="An account with this email already exists.")
    user = User(
        email=req.email,
        full_name=req.full_name,
        hashed_password=hash_password(req.password),
        role=req.role.upper() if req.role else "STUDENT",
        grade_level=req.grade_level,
        streak_days=1,
        avatar=f"https://api.dicebear.com/7.x/bottts/svg?seed={req.full_name}"
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    token = create_access_token(user.id)
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "role": user.role,
            "avatar": user.avatar,
            "streak_days": user.streak_days,
            "grade_level": user.grade_level
        }
    }

@router.post("/login")
def login(req: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email).first()
    if not user or not verify_password(req.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password.")
    token = create_access_token(user.id)
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "role": user.role,
            "avatar": user.avatar,
            "streak_days": user.streak_days,
            "grade_level": user.grade_level
        }
    }

@router.post("/demo-login")
def demo_login(req: DemoLoginRequest, db: Session = Depends(get_db)):
    target_role = req.role.upper()
    user = db.query(User).filter(User.role == target_role).first()
    if not user:
        user = db.query(User).filter(User.role == "STUDENT").first()
    if not user:
        raise HTTPException(status_code=404, detail="Demo user not found.")
    token = create_access_token(user.id)
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "role": user.role,
            "avatar": user.avatar,
            "streak_days": user.streak_days,
            "grade_level": user.grade_level
        }
    }

@router.get("/me")
def get_me(user: User = Depends(get_current_user)):
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return {
        "id": user.id,
        "email": user.email,
        "full_name": user.full_name,
        "role": user.role,
        "avatar": user.avatar,
        "streak_days": user.streak_days,
        "grade_level": user.grade_level
    }
