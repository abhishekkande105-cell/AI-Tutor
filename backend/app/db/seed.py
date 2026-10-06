import datetime
from sqlalchemy.orm import Session
from app.db.models import User, Subject, Topic, TutorSession, Message, Question, Attempt, Progress, CommonMistakeLog
from app.core.security import hash_password

def seed_database(db: Session):
    # Check if already seeded
    if db.query(User).filter(User.email == "student@socraticai.demo").first():
        return

    # 1. Users — Primary demo credentials (as specified in hackathon requirements)
    student = User(
        email="student@socraticai.demo",
        full_name="Alex Morgan",
        hashed_password=hash_password("password123"),
        role="STUDENT",
        avatar="https://api.dicebear.com/7.x/bottts/svg?seed=Alex",
        streak_days=7,
        grade_level="11th Grade High School / College Prep",
        created_at=datetime.datetime.utcnow() - datetime.timedelta(days=14)
    )

    teacher = User(
        email="teacher@socraticai.demo",
        full_name="Prof. Sarah Jenkins",
        hashed_password=hash_password("password123"),
        role="TEACHER",
        avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
        streak_days=30,
        grade_level="Faculty Lead - STEM",
        created_at=datetime.datetime.utcnow() - datetime.timedelta(days=60)
    )

    admin = User(
        email="admin@socraticai.demo",
        full_name="Dr. Aris Vance",
        hashed_password=hash_password("password123"),
        role="ADMIN",
        avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=Aris",
        streak_days=45,
        grade_level="System Dean",
        created_at=datetime.datetime.utcnow() - datetime.timedelta(days=90)
    )

    # Cohort students for Teacher Analytics
    cohort = [
        User(email="rahul@socraticai.demo", full_name="Rahul Sharma", hashed_password=hash_password("password123"), role="STUDENT", streak_days=2, grade_level="10th Grade"),
        User(email="priya@socraticai.demo", full_name="Priya Nair", hashed_password=hash_password("password123"), role="STUDENT", streak_days=3, grade_level="11th Grade"),
        User(email="aman@socraticai.demo", full_name="Aman Gupta", hashed_password=hash_password("password123"), role="STUDENT", streak_days=4, grade_level="11th Grade"),
        User(email="maya@socraticai.demo", full_name="Maya Patel", hashed_password=hash_password("password123"), role="STUDENT", streak_days=9, grade_level="12th Grade"),
        User(email="kevin@socraticai.demo", full_name="Kevin Chen", hashed_password=hash_password("password123"), role="STUDENT", streak_days=6, grade_level="10th Grade"),
        User(email="sophia@socraticai.demo", full_name="Sophia Rodriguez", hashed_password=hash_password("password123"), role="STUDENT", streak_days=12, grade_level="11th Grade"),
        User(email="liam@socraticai.demo", full_name="Liam Davies", hashed_password=hash_password("password123"), role="STUDENT", streak_days=5, grade_level="12th Grade"),
    ]

    db.add_all([student, teacher, admin] + cohort)
    db.commit()
    db.refresh(student)

    # 2. Subjects
    math = Subject(name="Mathematics", code="MATH", icon="Calculator", color="#2563eb", description="Algebra, geometry, calculus, and mathematical reasoning.")
    phys = Subject(name="Physics", code="PHYS", icon="Atom", color="#0284c7", description="Classical mechanics, kinematics, Newton's laws, energy, and waves.")
    chem = Subject(name="Chemistry", code="CHEM", icon="FlaskConical", color="#10b981", description="Atomic structure, chemical equations, stoichiometry, and bonding.")
    cs = Subject(name="Computer Science", code="CS", icon="Code2", color="#6366f1", description="Programming concepts, control flow, functions, loops, and logic.")
    sci = Subject(name="General Science", code="SCI", icon="Microscope", color="#f59e0b", description="Ecosystems, scientific inquiry, biology, and scientific method.")

    db.add_all([math, phys, chem, cs, sci])
    db.commit()
    for s in [math, phys, chem, cs, sci]:
        db.refresh(s)

    # 3. Topics
    top_algebra = Topic(subject_id=math.id, name="Algebra — Linear Equations", difficulty="Medium", order_index=1, description="Solve single and two-step linear equations using inverse operations.")
    top_quad = Topic(subject_id=math.id, name="Quadratic Equations", difficulty="Medium", order_index=2, description="Factoring, quadratic formula, and completing the square.")
    top_calc = Topic(subject_id=math.id, name="Calculus & Derivatives", difficulty="Hard", order_index=3, description="Rate of change, power rule, product rule, and chain rule.")
    top_geom = Topic(subject_id=math.id, name="Geometry — Angles & Triangles", difficulty="Easy", order_index=4, description="Geometric proofs, Pythagorean theorem, and triangle properties.")

    top_newton = Topic(subject_id=phys.id, name="Newton's Laws of Motion", difficulty="Medium", order_index=1, description="Inertia, F=ma, action-reaction pairs, and free-body diagrams.")
    top_work = Topic(subject_id=phys.id, name="Work, Energy & Power", difficulty="Medium", order_index=2, description="Conservation of mechanical energy and kinetic vs potential energy.")
    top_kinem = Topic(subject_id=phys.id, name="Kinematics in 1D", difficulty="Easy", order_index=3, description="Displacement, velocity, acceleration, and kinematic equations.")

    top_chem_eq = Topic(subject_id=chem.id, name="Chemical Equations & Balancing", difficulty="Medium", order_index=1, description="Conservation of mass and balancing chemical reactions.")
    top_mole = Topic(subject_id=chem.id, name="The Mole Concept & Stoichiometry", difficulty="Medium", order_index=2, description="Molar mass, Avogadro's number, and reactant calculations.")

    top_loops = Topic(subject_id=cs.id, name="Loops & Iteration in Python", difficulty="Easy", order_index=1, description="While loops, for loops, range, and iterable traversal.")
    top_funcs = Topic(subject_id=cs.id, name="Functions & Scope", difficulty="Medium", order_index=2, description="Parameters, return values, variable scope, and modular code.")

    all_topics = [
        top_algebra, top_quad, top_calc, top_geom,
        top_newton, top_work, top_kinem,
        top_chem_eq, top_mole,
        top_loops, top_funcs
    ]
    db.add_all(all_topics)
    db.commit()
    for t in all_topics:
        db.refresh(t)

    # 4. Questions
    q1 = Question(
        topic_id=top_algebra.id,
        prompt="Solve the linear equation: 2x + 5 = 15",
        difficulty="Medium",
        target_concept="Isolating the variable term using inverse operations.",
        hint_1="Look at the constant term +5 added to the 2x. What is the opposite operation of adding 5?",
        hint_2="Try subtracting 5 from both sides of the equation to isolate 2x.",
        hint_3="After subtracting 5, you have 2x = 10. Divide both sides by 2 to find x.",
        final_solution="x = 5"
    )

    q2 = Question(
        topic_id=top_algebra.id,
        prompt="Solve for y: 3y - 7 = 14",
        difficulty="Medium",
        target_concept="Two-step linear equations with negative constant.",
        hint_1="What operation can undo the -7 on the left side?",
        hint_2="Add 7 to both sides of the equation.",
        hint_3="Now divide both sides by 3 to isolate y.",
        final_solution="y = 7"
    )

    q3 = Question(
        topic_id=top_newton.id,
        prompt="A 5 kg block experiences a net force of 20 N. What is its acceleration?",
        difficulty="Easy",
        target_concept="Newton's Second Law: F = m * a.",
        hint_1="Recall Newton's second law: Force equals mass times acceleration (F = ma).",
        hint_2="You are given F = 20 N and m = 5 kg. Rearrange the formula to solve for acceleration: a = F / m.",
        hint_3="Calculate 20 divided by 5.",
        final_solution="a = 4 m/s²"
    )

    q4 = Question(
        topic_id=top_chem_eq.id,
        prompt="Balance the equation: H₂ + O₂ → H₂O",
        difficulty="Medium",
        target_concept="Balancing atoms on reactant and product sides.",
        hint_1="Count the oxygen atoms: there are 2 on the left (O₂) but only 1 on the right (H₂O). How can we balance the oxygen first?",
        hint_2="Place a coefficient of 2 in front of H₂O: H₂ + O₂ → 2H₂O. Now count the hydrogen atoms.",
        hint_3="Now you have 4 hydrogen atoms on the right. What coefficient should you place in front of H₂?",
        final_solution="2H₂ + O₂ → 2H₂O"
    )

    q5 = Question(
        topic_id=top_loops.id,
        prompt="How do you write a Python for loop that prints numbers from 0 to 4?",
        difficulty="Easy",
        target_concept="The range() function in Python loops.",
        hint_1="In Python, which built-in function produces a sequence of numbers starting from 0?",
        hint_2="The range(stop) function goes from 0 up to, but not including, the stop value.",
        hint_3="Use: for i in range(5): print(i)",
        final_solution="for i in range(5):\n    print(i)"
    )

    db.add_all([q1, q2, q3, q4, q5])
    db.commit()

    # 5. Common Mistakes
    mistakes = [
        CommonMistakeLog(topic_id=top_algebra.id, category="Sign errors", percentage=34, description="Flipping signs inconsistently when moving terms across the equals sign.", remediation_tip="Remind students to explicitly write out the operation on both sides."),
        CommonMistakeLog(topic_id=top_algebra.id, category="Incorrect equation transformation", percentage=27, description="Applying an operation to only one side of the equation.", remediation_tip="Prompt: 'Whatever we do to one side, we must do to the other side too.'"),
        CommonMistakeLog(topic_id=top_algebra.id, category="Calculation errors", percentage=18, description="Simple arithmetic errors during final division or addition steps.", remediation_tip="Encourage students to double check mental math before moving forward."),
        CommonMistakeLog(topic_id=top_newton.id, category="Missing vector direction", percentage=31, description="Treating forces as simple numbers without noting opposing directions.", remediation_tip="Ask: 'Which direction is friction or gravity acting compared to the push?'"),
        CommonMistakeLog(topic_id=top_newton.id, category="Unit conversion omission", percentage=29, description="Forgetting to convert grams to kilograms before calculating F = ma.", remediation_tip="Remind students that standard SI unit for mass in Newton's 2nd Law is kg."),
        CommonMistakeLog(topic_id=top_chem_eq.id, category="Altering subscripts instead of coefficients", percentage=38, description="Changing chemical formulas (like changing H2O to H2O2) instead of balancing coefficients.", remediation_tip="Explain that subscripts define the identity of the molecule and cannot be modified.")
    ]
    db.add_all(mistakes)
    db.commit()

    # 6. Progress Records for Student Alex Morgan (matches dashboard specs)
    # Math: 72%, Physics: 54%, Chemistry: 81%, CS: 67%
    prog_math = Progress(user_id=student.id, topic_id=top_algebra.id, mastery_score=72.0, questions_completed=48, accuracy_pct=86.0, last_studied_at=datetime.datetime.utcnow() - datetime.timedelta(hours=2))
    prog_phys = Progress(user_id=student.id, topic_id=top_newton.id, mastery_score=54.0, questions_completed=26, accuracy_pct=78.0, last_studied_at=datetime.datetime.utcnow() - datetime.timedelta(days=1))
    prog_chem = Progress(user_id=student.id, topic_id=top_chem_eq.id, mastery_score=81.0, questions_completed=32, accuracy_pct=91.0, last_studied_at=datetime.datetime.utcnow() - datetime.timedelta(days=2))
    prog_cs = Progress(user_id=student.id, topic_id=top_loops.id, mastery_score=67.0, questions_completed=18, accuracy_pct=82.0, last_studied_at=datetime.datetime.utcnow() - datetime.timedelta(days=3))
    db.add_all([prog_math, prog_phys, prog_chem, prog_cs])

    # Cohort student progress for Teacher Support feature
    # Rahul: 42% in Algebra, Priya: 48% in Calculus, Aman: 51% in Physics
    db.add(Progress(user_id=cohort[0].id, topic_id=top_algebra.id, mastery_score=42.0, questions_completed=14, accuracy_pct=42.0))
    db.add(Progress(user_id=cohort[1].id, topic_id=top_calc.id, mastery_score=48.0, questions_completed=19, accuracy_pct=48.0))
    db.add(Progress(user_id=cohort[2].id, topic_id=top_newton.id, mastery_score=51.0, questions_completed=16, accuracy_pct=51.0))
    db.add(Progress(user_id=cohort[3].id, topic_id=top_chem_eq.id, mastery_score=84.0, questions_completed=35, accuracy_pct=88.0))
    db.add(Progress(user_id=cohort[4].id, topic_id=top_algebra.id, mastery_score=78.0, questions_completed=29, accuracy_pct=79.0))
    db.add(Progress(user_id=cohort[5].id, topic_id=top_loops.id, mastery_score=89.0, questions_completed=40, accuracy_pct=92.0))
    db.add(Progress(user_id=cohort[6].id, topic_id=top_work.id, mastery_score=67.0, questions_completed=22, accuracy_pct=70.0))

    # 7. Past Tutor Sessions & Timeline Learning History for Alex Morgan
    # Today: Algebra — Linear Equations
    s1 = TutorSession(
        user_id=student.id,
        topic_id=top_algebra.id,
        title="Algebra — Linear Equations",
        difficulty="Medium",
        status="COMPLETED",
        current_step=3,
        total_steps=3,
        hints_used=1,
        started_at=datetime.datetime.utcnow() - datetime.timedelta(hours=3),
        completed_at=datetime.datetime.utcnow() - datetime.timedelta(hours=2, minutes=45)
    )
    db.add(s1)
    db.commit()
    db.refresh(s1)

    m1_1 = Message(session_id=s1.id, sender="STUDENT", content="Can you solve 2x + 5 = 15?", feedback_type="NORMAL")
    m1_2 = Message(session_id=s1.id, sender="AI", content="Absolutely! Let's work through it together. 😊\n\nFirst, look at the left side of the equation.\n\nWhat operation could we use to remove the +5?", feedback_type="GUIDANCE")
    m1_3 = Message(session_id=s1.id, sender="STUDENT", content="Subtract 5.", feedback_type="NORMAL")
    m1_4 = Message(session_id=s1.id, sender="AI", content="✓ That's the right approach!\n\nNow remember — whatever you do to one side, you need to do to the other side too.\n\nWhat do you get after subtracting 5?", feedback_type="CORRECT")
    m1_5 = Message(session_id=s1.id, sender="STUDENT", content="2x = 10", feedback_type="NORMAL")
    m1_6 = Message(session_id=s1.id, sender="AI", content="✓ Excellent thinking!\n\nYou're almost there. What operation isolates x when it's multiplied by 2?", feedback_type="CORRECT")
    m1_7 = Message(session_id=s1.id, sender="STUDENT", content="Divide by 2, so x = 5", feedback_type="NORMAL")
    m1_8 = Message(session_id=s1.id, sender="AI", content="🌟 Great job! You solved it yourself.\n\nx = 5 is correct! You discovered the answer through inverse operations step-by-step.", feedback_type="SOLVED")

    db.add_all([m1_1, m1_2, m1_3, m1_4, m1_5, m1_6, m1_7, m1_8])

    # Yesterday: Physics — Newton's Laws
    s2 = TutorSession(
        user_id=student.id,
        topic_id=top_newton.id,
        title="Physics — Newton's Laws",
        difficulty="Medium",
        status="COMPLETED",
        current_step=2,
        total_steps=2,
        hints_used=2,
        started_at=datetime.datetime.utcnow() - datetime.timedelta(days=1, hours=4),
        completed_at=datetime.datetime.utcnow() - datetime.timedelta(days=1, hours=3, minutes=30)
    )
    # 2 days ago: Programming — Loops
    s3 = TutorSession(
        user_id=student.id,
        topic_id=top_loops.id,
        title="Programming — Loops",
        difficulty="Easy",
        status="COMPLETED",
        current_step=2,
        total_steps=2,
        hints_used=0,
        started_at=datetime.datetime.utcnow() - datetime.timedelta(days=2, hours=5),
        completed_at=datetime.datetime.utcnow() - datetime.timedelta(days=2, hours=4, minutes=40)
    )
    db.add_all([s2, s3])

    # Attempts
    att1 = Attempt(user_id=student.id, question_id=q1.id, is_correct=True, hints_used=1, attempts_count=1, completed_at=datetime.datetime.utcnow() - datetime.timedelta(hours=2))
    att2 = Attempt(user_id=student.id, question_id=q3.id, is_correct=True, hints_used=2, attempts_count=2, completed_at=datetime.datetime.utcnow() - datetime.timedelta(days=1))
    att3 = Attempt(user_id=student.id, question_id=q5.id, is_correct=True, hints_used=0, attempts_count=1, completed_at=datetime.datetime.utcnow() - datetime.timedelta(days=2))
    db.add_all([att1, att2, att3])

    db.commit()
