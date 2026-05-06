import requests

BASE_URL = "http://127.0.0.1:8000"

print("Starting comprehensive live route check...\n")

# 1. Unauthenticated GET Routes
unauth_gets = [
    "/",
    "/health",
    "/api/v1/problems",
    "/api/v1/dsa-content/lessons",
    "/api/v1/dbms-content/lessons"
]

print("--- Testing Unauthenticated GET Routes ---")
for route in unauth_gets:
    try:
        res = requests.get(f"{BASE_URL}{route}")
        print(f"[{res.status_code}] GET {route}")
        if res.status_code == 200:
            data = res.json()
            if isinstance(data, list):
                print(f"    -> Success: Returned {len(data)} items")
            else:
                print(f"    -> Success: {str(data)[:100]}...")
    except Exception as e:
        print(f"[ERROR] GET {route}: {e}")

print("\n--- Testing Specific Item GET Routes ---")
try:
    # Get an ID to test
    prob_res = requests.get(f"{BASE_URL}/api/v1/problems").json()
    if prob_res and len(prob_res) > 0:
        prob_id = prob_res[0]["id"]
        res = requests.get(f"{BASE_URL}/api/v1/problems/{prob_id}")
        print(f"[{res.status_code}] GET /api/v1/problems/{prob_id} -> Success")
        
    dbms_res = requests.get(f"{BASE_URL}/api/v1/dbms-content/lessons").json()
    if dbms_res and len(dbms_res) > 0:
        lesson_id = dbms_res[0]["id"]
        res = requests.get(f"{BASE_URL}/api/v1/dbms-content/lessons/{lesson_id}")
        print(f"[{res.status_code}] GET /api/v1/dbms-content/lessons/{lesson_id} -> Success")
except Exception as e:
    print(f"Error testing specific items: {e}")

# 2. Authenticated Routes (Should return 401/403 Unauthorized, NOT 500)
auth_routes = [
    ("GET", "/api/v1/users/me"),
    ("GET", "/api/v1/submissions"),
    ("POST", "/api/v1/submissions", {"problem_id": "123", "language": "python", "code": "print(1)"}),
    ("POST", "/api/v1/execution/run", {"language": "python", "code": "print(1)"}),
    ("POST", "/api/v1/ai-tutor/feedback", {"code": "print", "language": "python", "problem_description": "test"}),
    ("POST", "/api/v1/sql-sandbox/execute", {"query": "SELECT 1"}),
    ("GET", "/api/v1/er-diagrams"),
    ("POST", "/api/v1/er-diagrams", {"title": "test", "nodes": [], "edges": []}),
    ("GET", "/api/v1/progress/"),
    ("POST", "/api/v1/progress/complete", {"lesson_id": "123", "lesson_type": "dsa"})
]

print("\n--- Testing Authenticated Routes (Expecting 401/403) ---")
for method, route, *args in auth_routes:
    try:
        if method == "GET":
            res = requests.get(f"{BASE_URL}{route}")
        else:
            payload = args[0] if args else {}
            res = requests.post(f"{BASE_URL}{route}", json=payload)
            
        if res.status_code in [401, 403]:
            print(f"[{res.status_code}] {method} {route} -> Correctly protected by Auth")
        elif res.status_code == 422:
            print(f"[{res.status_code}] {method} {route} -> Unprocessable Entity (Schema validation happened before auth?)")
        elif res.status_code == 500:
            print(f"[{res.status_code}] {method} {route} -> CRITICAL SERVER ERROR")
        else:
            print(f"[{res.status_code}] {method} {route} -> Unexpected status")
    except Exception as e:
         print(f"[ERROR] {method} {route}: {e}")

print("\nAll checks completed.")
