# SocraticAI — “A Tutor That Won’t Give You the Answer”

> **Tagline:** *“Learn the concept. Solve it yourself.”*  
> **Mission:** Transform AI from an answer-spitting calculator into a patient, encouraging academic teacher that guides students to discover solutions independently.

---

## 🌟 Overview & Core Philosophy

**SocraticAI** is a full-stack educational tutoring platform built for the hackathon problem statement:  
*“A Tutor That Won’t Give You the Answer”*.

Unlike generic chatbots that immediately reveal answers—bypassing the crucial cognitive struggle where actual learning occurs—SocraticAI:
1. **Never dumps the final solution** immediately.
2. **Employs Socratic inquiry**: asks guiding questions one step at a time.
3. **Features a 3-tier progressive hint ladder**: Conceptual Nudge → Strategic Direction → Operational Guidance.
4. **Provides empathetic teacher feedback**:
   - `✓ That's the right approach.`
   - `✓ Excellent thinking!`
   - `💡 Good idea — now take the next step.`
   - `🔎 Let's check that step again.`
   - `🌟 Great job! You solved it yourself.` (with celebratory confetti!)
5. **Tracks long-term student progress & streaks** (Overall Mastery 78%, Accuracy 84%, 7-Day Streak, 12h 42m study time).
6. **Empowers teachers with classroom management**:
   - High-level cohort KPIs (128 students, 84 active today, 76% avg accuracy, 2,431 questions attempted)
   - Common mistake pattern recognition (Sign errors 34%, Equation transformation errors 27%, Calculation errors 18%)
   - **Students Needing Support** triage (Rahul 42%, Priya 48%, Aman 51%) with actionable diagnostic inspection.

---

## 🛠️ Tech Stack

- **Frontend:**
  - React 19 + TypeScript + Vite
  - Tailwind CSS (Curated academic palette: deep navy `#1e3a8a`, clean slate backgrounds, soft neutral cards)
  - Recharts (Subject Performance bar charts, Weekly Activity area charts, Topic Strength diagnostics)
  - Lucide React (Academic & classroom icons)
  - Canvas Confetti (Celebratory feedback when students solve equations independently)

- **Backend:**
  - Python 3.12 + FastAPI
  - SQLite (with SQLAlchemy ORM, clean architecture ready for PostgreSQL)
  - JWT Authentication & Bcrypt / salted hashing
  - Gemma AI Integration (via official `google-genai` SDK for Gemini/Gemma models + intelligent pedagogical engine fallback for guaranteed offline hackathon demos)

---

## 🚀 Quick Start Instructions

### 1. Prerequisites
- Python 3.10+ (tested on Python 3.12)
- Node.js 18+ (tested on Node v24)
- npm

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create and activate a Python virtual environment (if not already created)
python -m venv .venv
# On Windows:
.venv\Scripts\activate
# On Linux/macOS:
# source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the FastAPI server
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
The backend API is now live at: `http://127.0.0.1:8000` (Docs: `http://127.0.0.1:8000/docs`).

### 3. Frontend Setup
```bash
# In a new terminal, navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev -- --host 127.0.0.1 --port 5173
```
Open your browser at: `http://127.0.0.1:5173/`

---

## 🔑 Environment Variables & Gemma AI Configuration

Create a `.env` file in the `backend/` directory (a template is provided in `backend/.env.example`):

```env
PROJECT_NAME="SocraticAI"
SECRET_KEY="socratic_super_secret_hackathon_jwt_key_2026"
DATABASE_URL="sqlite:///./socratic_ai.db"

# GEMMA / GEMINI AI CONFIGURATION:
# Provide your Google Gemini or Gemma API key to enable live AI responses:
GEMINI_API_KEY=""
GEMMA_API_KEY=""

# If GEMINI_API_KEY is left empty, SocraticAI runs in intelligent Demo Mode:
DEMO_MODE="true"
```

- **When `GEMINI_API_KEY` is provided**: The app connects directly to Google's model and displays the `✨ Gemma AI Connected` green badge.
- **When no key is configured**: The app runs in `Demo Mode (Pedagogical Engine)`, which accurately simulates the entire Socratic teaching dialogue, tiered hints, error detection, and progress updating without crashing.

---

## 👥 Demo Accounts & Instant Role Switcher

For rapid judging and demonstration, you can switch roles with a single click in the top navigation bar:

| Role | Email | Password | Pre-loaded Context |
| :--- | :--- | :--- | :--- |
| **Student** | `student@socratic.ai` | `password123` | Alex Morgan (11th Grade, 7-Day Streak, 78% Mastery) |
| **Teacher** | `teacher@socratic.ai` | `password123` | Prof. Sarah Jenkins (Lead STEM Faculty, 128 students cohort) |
| **Admin** | `admin@socratic.ai` | `password123` | Dr. Aris Vance (System Dean) |

---

## 🎯 3-Minute Hackathon Demo Script

Follow this sequence to showcase the complete vision:

1. **Landing Page (`/`)**:
   - Review hero statement: *“Your personal AI teacher — not an answer machine.”*
   - See the comparative analysis: *Traditional Chatbot (Zero retention)* vs *SocraticAI (100% Concept Mastery)*.
   - Click **“Start Learning”**.
2. **Student Dashboard (`/dashboard`)**:
   - Greeted by *“Good morning, Alex! 👋”* with 7-Day Streak badge.
   - Inspect subject mastery cards: Mathematics 72%, Physics 54%, Chemistry 81%, Programming 67%.
   - Click **“Resume Tutoring”** on *“Solve 2x + 5 = 15 with inverse operations”*.
3. **AI Tutor Classroom (`/tutor`)**:
   - Header shows: `👩‍🏫 SocraticAI Tutor` — *“Let's solve this together.”*
   - Tutor asks: *“What operation could we use to remove the +5?”*
   - Click the quick response chip **“Subtract 5”** (or type it).
   - AI evaluates: `✓ That's the right approach! Whatever you do to one side, you need to do to the other side too. What do you get after subtracting 5?`
   - Click **“2x = 10”**.
   - Click **“Divide by 2 (x = 5)”**.
   - AI celebrates: `🌟 Great job! You solved it yourself: x = 5!` + Confetti burst!
   - Test the Hint Ladder: Click **“Ask for Hint”** to see `Hint 1 of 3: Conceptual Nudge`.
4. **Learning Progress Analytics (`/progress`)**:
   - View updated stats: Overall Mastery 78%, Questions Completed 124, Accuracy 84%, Study Time 12h 42m.
   - Interactive Recharts: Subject Performance Bar Chart, Weekly Learning Activity Area Chart, and Topic Strength diagnostics.
5. **Teacher Dashboard (`/teacher`)**:
   - Switch role to **Teacher** in top navbar.
   - Review faculty metrics: 128 Total Students, 84 Active Today, 76% Avg Accuracy, 2,431 Questions Attempted.
   - Inspect **Common Algebra Mistakes**:
     - *1. Sign errors (34%)*
     - *2. Incorrect equation transformation (27%)*
     - *3. Calculation errors (18%)*
   - Inspect **Students Needing Support**:
     - *Rahul (Algebra, 42%)*
     - *Priya (Calculus, 48%)*
     - *Aman (Physics, 51%)*
   - Click **“View Progress”** on Rahul to open the diagnostic triage drawer with targeted teacher remediation recommendations.

---

## 🧪 Automated Integration Tests

Run the built-in test suite to verify all 10 API endpoints, Socratic dialogue steps, and teacher metrics:
```bash
cd backend
python test_integration.py
```
Expected output:
```
Beginning SocraticAI Integration Test Suite...
1. Status Check: {'mode': 'Demo Mode', 'gemma_configured': False, 'system_ready': True}
2. Student Auth: Alex Morgan (Role: STUDENT, Streak: 7 days)
3. Created Tutor Session #5: Algebra — Linear Equations
4. Socratic Tutor Step 1 Feedback [GUIDANCE]
5. Socratic Tutor Step 2 Feedback [CORRECT]
6. Tiered Hint Ladder [Hint 1 of 3: Conceptual Nudge]
7. Final Step Solved Feedback [SOLVED]
8. Progress Metrics: Overall 78%, Accuracy 84%, Completed 124 questions
9. Teacher Dashboard: Students 128, Active 84, Accuracy 76%
10. Priority Students Needing Support: Rahul (42%), Priya (48%), Aman (51%)
==================================================
SUCCESS: ALL 10 SOCRATIC INTEGRATION TESTS PASSED!
==================================================
```

---

## 🏛️ Project Directory Structure

```
ai tutor/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth.py          # Register, login, me, and 1-click demo login
│   │   │   ├── subjects.py      # Subjects and curriculum topics
│   │   │   ├── tutor.py         # Socratic sessions, messages, and tiered hints
│   │   │   ├── progress.py      # Analytics metrics & timeline history
│   │   │   ├── practice.py      # Difficulty-targeted practice questions
│   │   │   ├── teacher.py       # Faculty dashboard, common mistakes & support
│   │   │   └── status.py        # Health & Gemma connection status
│   │   ├── core/
│   │   │   ├── config.py        # Settings and environment variables
│   │   │   └── security.py      # Bcrypt/salted hashing & JWT tokens
│   │   ├── db/
│   │   │   ├── database.py      # SQLAlchemy engine and session factory
│   │   │   ├── models.py        # User, Subject, Topic, TutorSession, Message, etc.
│   │   │   └── seed.py          # Rich seed data for students, teacher, questions
│   │   ├── services/
│   │   │   └── socratic_tutor.py # Gemma AI client + pedagogical teacher engine
│   │   └── main.py              # FastAPI server with lifespan DB auto-seeding
│   ├── requirements.txt
│   ├── test_integration.py
│   ├── .env.example
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.tsx       # Logo, Gemma connection badge & role switcher
│   │   │   ├── Sidebar.tsx      # Academic workspace navigation & streak widget
│   │   │   ├── FeedbackBadge.tsx# Socratic feedback tags (Correct, Guidance, Solved)
│   │   │   └── Confetti.ts      # Celebration effect on problem self-discovery
│   │   ├── context/
│   │   │   └── AuthContext.tsx  # User state & instant demo authentication
│   │   ├── pages/
│   │   │   ├── LandingPage.tsx  # Hero, "Anti-answer machine", contrast cards
│   │   │   ├── StudentDashboard.tsx # Good morning Alex, streak, cards
│   │   │   ├── TutorPage.tsx    # Socratic classroom, tiered hints, answer input
│   │   │   ├── PracticePage.tsx # Practice mode by subject/topic/difficulty
│   │   │   ├── SubjectsPage.tsx # My Subjects catalog & curriculum topics
│   │   │   ├── ProgressPage.tsx # Recharts mastery & study analytics
│   │   │   ├── HistoryPage.tsx  # Chronological learning timeline
│   │   │   └── TeacherDashboard.tsx # Faculty console, mistake analytics & triage
│   │   ├── services/
│   │   │   └── api.ts           # REST API client
│   │   ├── types/
│   │   │   └── index.ts         # TypeScript data contracts
│   │   ├── App.tsx              # App container & 3-minute Judge Demo Guide
│   │   ├── index.css            # Tailwind directives & typography layers
│   │   └── main.tsx
│   ├── index.html               # Google Fonts Inter & Outfit, SEO metadata
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── package.json
└── README.md
```

---

## 🏆 Key Differentiators for Hackathon Judges

1. **True Socratic Pedagogy**: Rather than regurgitating formulas, the AI systematically questions the student's reasoning to build genuine conceptual intuition.
2. **Scaffolded 3-Tier Hints**: Students never receive a blunt spoiler; hints guide thought progressively.
3. **Teacher-Centric Intelligence**: Shifts the narrative from "students cheating with AI" to "educators diagnosing systemic learning bottlenecks and helping struggling learners".
4. **Dual Execution Mode**: Works right out of the box with zero setup in Demo Mode, and connects seamlessly to Google's Gemma/Gemini models when an API key is provided.
