import os
import sys
import uuid
import unittest
from fastapi.testclient import TestClient

# Add backend to path so we can import app
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend")))

from app.main import app
from app.core.db import SessionLocal
from app.models.user import User
from app.core.security import decode_access_token

class TestAuthFlow(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        """Ensure test users are deleted from the database before starting."""
        db = SessionLocal()
        try:
            # Delete any pre-existing test users to ensure clean state
            db.query(User).filter(User.email.in_([
                "test@careerpilot.com", 
                "weak@careerpilot.com", 
                "test_upper@careerpilot.com"
            ])).delete(synchronize_session=False)
            db.commit()
        finally:
            db.close()
        cls.client = TestClient(app)

    def test_all_auth_flows(self):
        client = self.client

        # --- Test 1 — Register new user ---
        register_payload = {
            "email": "test@careerpilot.com",
            "password": "Career@2026",
            "full_name": "Test User"
        }
        response = client.post("/api/v1/auth/register", json=register_payload)
        self.assertEqual(response.status_code, 201, f"Test 1 failed: {response.text}")
        user_data = response.json()
        self.assertEqual(user_data["email"], "test@careerpilot.com")
        self.assertEqual(user_data["full_name"], "Test User")
        self.assertEqual(user_data["auth_provider"], "LOCAL")
        self.assertNotIn("password", user_data)
        self.assertNotIn("hashed_password", user_data)
        registered_user_id = user_data["id"]
        print("\n[SUCCESS] Test 1 Register successfully passed.")

        # --- Test 1.5 — Weak password rejection ---
        weak_payload = {
            "email": "weak@careerpilot.com",
            "password": "password123",
            "full_name": "Weak User"
        }
        response = client.post("/api/v1/auth/register", json=weak_payload)
        self.assertEqual(response.status_code, 422, f"Test 1.5 failed: expected 422, got {response.status_code}")
        error_data = response.json()
        self.assertTrue(error_data["error"])
        self.assertEqual(error_data["status_code"], 422)
        self.assertIn("Validation error", error_data["message"])
        # Check that a specific password requirement error is present
        details = error_data["detail"]
        self.assertTrue(any("password" in str(d) for d in details))
        
        # Verify no user created in db
        db = SessionLocal()
        try:
            weak_user = db.query(User).filter(User.email == "weak@careerpilot.com").first()
            self.assertIsNone(weak_user, "Weak user was created in the database!")
        finally:
            db.close()
        print("[SUCCESS] Test 1.5 Weak password rejection successfully passed.")

        # --- Test 2 — Duplicate email ---
        response = client.post("/api/v1/auth/register", json=register_payload)
        self.assertEqual(response.status_code, 400, f"Test 2 failed: expected 400, got {response.status_code}")
        error_data = response.json()
        self.assertTrue(error_data["error"])
        self.assertEqual(error_data["status_code"], 400)
        self.assertEqual(error_data["message"], "Email already registered")
        print("[SUCCESS] Test 2 Duplicate email rejection successfully passed.")

        # --- Test 2.5 — Email normalization ---
        upper_payload = {
            "email": "TEST@CAREERPILOT.COM",
            "password": "Career@2026",
            "full_name": "Test Upper"
        }
        response = client.post("/api/v1/auth/register", json=upper_payload)
        self.assertEqual(response.status_code, 400, f"Test 2.5 failed: expected 400, got {response.status_code}")
        error_data = response.json()
        self.assertTrue(error_data["error"])
        self.assertEqual(error_data["status_code"], 400)
        self.assertEqual(error_data["message"], "Email already registered")
        print("[SUCCESS] Test 2.5 Email normalization duplicate check successfully passed.")

        # --- Test 3 — Login success ---
        login_payload = {
            "email": "test@careerpilot.com",
            "password": "Career@2026"
        }
        response = client.post("/api/v1/auth/login", json=login_payload)
        self.assertEqual(response.status_code, 200, f"Test 3 failed: {response.text}")
        login_data = response.json()
        self.assertEqual(login_data["message"], "Login successful")
        self.assertEqual(login_data["user"]["email"], "test@careerpilot.com")
        self.assertNotIn("password", login_data["user"])
        self.assertNotIn("hashed_password", login_data["user"])
        
        # Verify cookie
        self.assertIn("access_token", client.cookies, "Test 3 failed: access_token cookie not set")
        print("[SUCCESS] Test 3 Login success successfully passed.")

        # --- Test 3.5 — Verify JWT ---
        access_token = client.cookies.get("access_token")
        self.assertIsNotNone(access_token)
        token_data = decode_access_token(access_token)
        self.assertIsNotNone(token_data, "Test 3.5 failed: JWT decoding failed")
        self.assertEqual(token_data.email, "test@careerpilot.com")
        self.assertEqual(token_data.provider, "LOCAL")
        # Verify user_id is a valid UUID
        try:
            uuid.UUID(token_data.user_id)
        except ValueError:
            self.fail("Test 3.5 failed: decoded user_id is not a valid UUID")
        print("[SUCCESS] Test 3.5 JWT decoding and validation successfully passed.")

        # --- Test 4 — Wrong password ---
        wrong_payload = {
            "email": "test@careerpilot.com",
            "password": "WrongPass@123"
        }
        # Clear client cookies to avoid passing auth in request
        client.cookies.clear()
        response = client.post("/api/v1/auth/login", json=wrong_payload)
        self.assertEqual(response.status_code, 401, f"Test 4 failed: expected 401, got {response.status_code}")
        error_data = response.json()
        self.assertTrue(error_data["error"])
        self.assertEqual(error_data["status_code"], 401)
        self.assertEqual(error_data["message"], "Invalid credentials")
        print("[SUCCESS] Test 4 Wrong password rejection successfully passed.")

        # --- Test 5 — Protected route ---
        # Re-login to get the cookies
        response = client.post("/api/v1/auth/login", json=login_payload)
        self.assertEqual(response.status_code, 200)
        
        response = client.get("/api/v1/auth/me")
        self.assertEqual(response.status_code, 200, f"Test 5 failed: {response.text}")
        me_data = response.json()
        self.assertEqual(me_data["email"], "test@careerpilot.com")
        self.assertEqual(me_data["id"], registered_user_id)
        self.assertNotIn("password", me_data)
        self.assertNotIn("hashed_password", me_data)
        print("[SUCCESS] Test 5 Protected route access successfully passed.")

        # --- Test 6 — Logout ---
        response = client.post("/api/v1/auth/logout")
        self.assertEqual(response.status_code, 200, f"Test 6 failed: {response.text}")
        logout_data = response.json()
        self.assertEqual(logout_data["message"], "Logged out successfully")
        # Verify cookie is cleared
        self.assertIsNone(client.cookies.get("access_token"))
        print("[SUCCESS] Test 6 Logout successfully passed.")

        # --- Test 7 — After logout ---
        response = client.get("/api/v1/auth/me")
        self.assertEqual(response.status_code, 401, f"Test 7 failed: expected 401, got {response.status_code}")
        error_data = response.json()
        self.assertTrue(error_data["error"])
        self.assertEqual(error_data["status_code"], 401)
        self.assertEqual(error_data["message"], "Not authenticated")
        print("[SUCCESS] Test 7 Accessing protected route after logout rejection successfully passed.")

        # --- Test 8 — Health check ---
        response = client.get("/health")
        self.assertEqual(response.status_code, 200, f"Test 8 failed: {response.text}")
        health_data = response.json()
        self.assertEqual(health_data["status"], "healthy")
        self.assertEqual(health_data["database"], "healthy")
        print("[SUCCESS] Test 8 Health check successfully passed.")

if __name__ == "__main__":
    unittest.main()
