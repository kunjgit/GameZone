import unittest
from selenium import webdriver

class TestFrontendIntegration(unittest.TestCase):

    def setUp(self):
        self.driver = webdriver.Chrome()
        self.driver.get("http://localhost:8000")

    def test_homepage_load(self):
        self.assertEqual(self.driver.title, "GameZone - Home")

    def test_game_page(self):
        game_link = self.driver.find_element_by_link_text("Play Now")
        game_link.click()
        self.assertEqual(self.driver.current_url, "http://localhost:8000/game")

    def tearDown(self):
        self.driver.quit()

if __name__ == "__main__":
    unittest.main()
