import requests
import unittest

class TestAPIIntegration(unittest.TestCase):

    def test_get_game_list(self):
        # Test API endpoint for retrieving game list
        response = requests.get('http://localhost:5000/api/games')
        self.assertEqual(response.status_code, 200)
        games = response.json()
        self.assertTrue(len(games) > 0)

if __name__ == '__main__':
    unittest.main()
