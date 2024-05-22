import unittest
import requests

class TestSecurityVulnerabilities(unittest.TestCase):

    def test_sql_injection(self):
        # Test for SQL Injection vulnerability
        username = "' OR 1=1 --"
        password = "any_password"
        response = requests.post('http://localhost:5000/login', data={'username': username, 'password': password})
        self.assertNotIn('Login successful', response.text)

if __name__ == '__main__':
    unittest.main()
