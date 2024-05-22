import unittest
from gamezone import authenticate_user

class TestAuthentication(unittest.TestCase):
    
    def test_valid_login(self):
        # Test valid login
        result = authenticate_user("user1", "password123")
        self.assertTrue(result)

    def test_invalid_login(self):
        # Test invalid login
        result = authenticate_user("user1", "wrongpassword")
        self.assertFalse(result)

if __name__ == '__main__':
    unittest.main()
