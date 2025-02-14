import os
import unittest
from pprint import pprint

from dotenv import load_dotenv, find_dotenv

from flask_server.maps_functions import optimize


class MyTestCase(unittest.TestCase):
    def setUp(self):
        dotenv_path = find_dotenv()
        if dotenv_path:
            load_dotenv(dotenv_path)
            print("loaded .env file")
        else:
            print("no .env file found")

    def test_optimize(self):
        print(os.getenv('ORS_KEY'))
        coords = ((8.34234,48.23424),(8.34423,48.26424), (8.34523,48.24424), (8.41423,48.21424))
        pprint(optimize(coords))
        # self.assertEqual(True, False)  # add assertion here


if __name__ == '__main__':

    unittest.main()
