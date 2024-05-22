import unittest
from game import Game

class TestGameFunctionality(unittest.TestCase):
    
    def setUp(self):
        self.game = Game()

    def test_initialization(self):
        self.assertEqual(self.game.level, 1)
        self.assertEqual(self.game.score, 0)
        self.assertFalse(self.game.is_game_over)

    def test_level_up(self):
        self.game.level_up()
        self.assertEqual(self.game.level, 2)

    def test_score_update(self):
        self.game.update_score(100)
        self.assertEqual(self.game.score, 100)

    def test_game_over(self):
        self.game.game_over()
        self.assertTrue(self.game.is_game_over)

if __name__ == '__main__':
    unittest.main()
