"""
Simple test script to verify the authentication implementation
"""
import requests
import json

# Base URL for the backend API
BASE_URL = "http://localhost:8000"

def test_signup():
    """Test user signup with background information"""
    print("Testing signup...")
    signup_data = {
        "email": "test@example.com",
        "password": "testpass123",
        "software_level": "beginner",
        "hardware_background": "robotics"
    }

    try:
        response = requests.post(f"{BASE_URL}/api/auth/signup", json=signup_data)
        print(f"Signup response: {response.status_code}")
        print(f"Response data: {response.json()}")
        return response.json()
    except Exception as e:
        print(f"Signup error: {e}")
        return None

def test_signin():
    """Test user signin"""
    print("\nTesting signin...")
    signin_data = {
        "email": "test@example.com",
        "password": "testpass123"
    }

    try:
        # Using form data for signin as per our API
        response = requests.post(f"{BASE_URL}/api/auth/signin", data=signin_data)
        print(f"Signin response: {response.status_code}")
        print(f"Response data: {response.json()}")
        return response.json()
    except Exception as e:
        print(f"Signin error: {e}")
        return None

def test_get_personalization_context(token):
    """Test getting personalization context"""
    print("\nTesting personalization context...")
    headers = {
        "Authorization": f"Bearer {token}"
    }

    try:
        response = requests.get(f"{BASE_URL}/api/personalization/context", headers=headers)
        print(f"Personalization context response: {response.status_code}")
        print(f"Response data: {response.json()}")
        return response.json()
    except Exception as e:
        print(f"Personalization context error: {e}")
        return None

if __name__ == "__main__":
    print("Starting authentication tests...")

    # Test signup
    signup_result = test_signup()

    # Test signin
    signin_result = test_signin()

    if signin_result and signin_result.get("success"):
        token = signin_result.get("session_token")
        if token:
            # Test personalization context
            test_get_personalization_context(token)

    print("\nTests completed!")