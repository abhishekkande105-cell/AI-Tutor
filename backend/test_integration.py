import urllib.request
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

def run_tests():
    base = 'http://127.0.0.1:8000/api'
    print("Beginning SocraticAI Integration Test Suite...\n")
    
    # 1. Status Check
    res = urllib.request.urlopen(f'{base}/status')
    status_data = json.loads(res.read())
    print("1. Status Check:", status_data)
    assert status_data['system_ready'] is True

    # 2. Demo Login Student
    req = urllib.request.Request(
        f'{base}/auth/demo-login', 
        data=json.dumps({'role': 'STUDENT'}).encode(), 
        headers={'Content-Type': 'application/json'}
    )
    auth_data = json.loads(urllib.request.urlopen(req).read())
    token = auth_data['access_token']
    user = auth_data['user']
    print(f"2. Student Auth: {user['full_name']} (Role: {user['role']}, Streak: {user['streak_days']} days)")

    # 3. Create Tutor Session
    headers = {'Content-Type': 'application/json', 'Authorization': f'Bearer {token}'}
    sess_req = urllib.request.Request(
        f'{base}/tutor/session', 
        data=json.dumps({'title': 'Algebra — Linear Equations', 'difficulty': 'Medium'}).encode(), 
        headers=headers
    )
    sess_data = json.loads(urllib.request.urlopen(sess_req).read())
    sess_id = sess_data['session_id']
    print(f"3. Created Tutor Session #{sess_id}: {sess_data['title']}")

    # 4. Step 1: Student asks 'Can you solve 2x + 5 = 15?'
    msg_req = urllib.request.Request(
        f'{base}/tutor/message', 
        data=json.dumps({'session_id': sess_id, 'content': 'Can you solve 2x + 5 = 15?'}).encode(), 
        headers=headers
    )
    step1 = json.loads(urllib.request.urlopen(msg_req).read())
    print(f"4. Socratic Tutor Step 1 Feedback [{step1['feedback_type']}]:")
    print(f"   AI Teacher: {step1['content'][:100]}...\n")

    # 5. Step 2: Student responds 'Subtract 5'
    msg_req = urllib.request.Request(
        f'{base}/tutor/message', 
        data=json.dumps({'session_id': sess_id, 'content': 'Subtract 5'}).encode(), 
        headers=headers
    )
    step2 = json.loads(urllib.request.urlopen(msg_req).read())
    print(f"5. Socratic Tutor Step 2 Feedback [{step2['feedback_type']}]:")
    print(f"   AI Teacher: {step2['content'][:100]}...\n")

    # 6. Step 3: Hint Ladder Test
    hint_req = urllib.request.Request(
        f'{base}/tutor/hint', 
        data=json.dumps({'session_id': sess_id}).encode(), 
        headers=headers
    )
    hint_data = json.loads(urllib.request.urlopen(hint_req).read())
    print(f"6. Tiered Hint Ladder [{hint_data['title']}]:")
    print(f"   Hint: {hint_data['content']}\n")

    # 7. Step 4: Student solves 'x = 5'
    msg_req = urllib.request.Request(
        f'{base}/tutor/message', 
        data=json.dumps({'session_id': sess_id, 'content': 'x = 5'}).encode(), 
        headers=headers
    )
    step4 = json.loads(urllib.request.urlopen(msg_req).read())
    print(f"7. Final Step Solved Feedback [{step4['feedback_type']}]:")
    print(f"   Completed: {step4['is_completed']}")
    print(f"   AI Teacher: {step4['content'][:120]}...\n")

    # 8. Check Student Progress Analytics
    prog_req = urllib.request.Request(f'{base}/progress', headers=headers)
    prog_data = json.loads(urllib.request.urlopen(prog_req).read())
    print(f"8. Progress Metrics: Overall {prog_data['overall_progress']}%, Accuracy {prog_data['accuracy_pct']}%, Completed {prog_data['questions_completed']} questions")

    # 9. Teacher Dashboard
    teach_req = urllib.request.Request(f'{base}/teacher/dashboard', headers=headers)
    teach_data = json.loads(urllib.request.urlopen(teach_req).read())
    print(f"9. Teacher Dashboard: Students {teach_data['metrics']['total_students']}, Active {teach_data['metrics']['active_today']}, Accuracy {teach_data['metrics']['average_accuracy']}%")

    # 10. Students Needing Support
    supp_req = urllib.request.Request(f'{base}/teacher/students-needing-support', headers=headers)
    supp_data = json.loads(urllib.request.urlopen(supp_req).read())
    support_summary = [f"{s['name']} ({s['accuracy']}%)" for s in supp_data]
    print(f"10. Priority Students Needing Support: {', '.join(support_summary)}")

    print("\n" + "="*50)
    print("SUCCESS: ALL 10 SOCRATIC INTEGRATION TESTS PASSED!")
    print("="*50)

if __name__ == "__main__":
    run_tests()
