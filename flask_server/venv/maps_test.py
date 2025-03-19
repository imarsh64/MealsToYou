import unittest
import pandas as pd


from flask_server.maps import get_osrm_route


class MyTestCase(unittest.TestCase):
    def test_orsm_route(self):
        coordinates = [
            [31.5497, -97.1131],  # Waco Suspension Bridge
            [31.5598, -97.1418],  # ALICO Building
            [31.5494, -97.1135],  # Texas Ranger Hall of Fame and Museum
            [31.5491, -97.1139],  # Dr Pepper Museum
            [31.5505, -97.1143],  # Waco-McLennan County Library
            [31.5500, -97.1147],  # Mayborn Museum Complex
            [31.5509, -97.1151],  # Lee Lockwood Library and Museum
            [31.5512, -97.1155],  # Armstrong Browning Library
            [31.5516, -97.1159],  # Baylor University
            [31.5520, -97.1163]  # McLennan Community College
        ]

        print(get_osrm_route(coordinates))




if __name__ == '__main__':
    unittest.main()
