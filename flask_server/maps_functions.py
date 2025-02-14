import os

import openrouteservice

def optimize(coords):
    client = openrouteservice.Client(key=os.getenv('ORS_KEY'))
    routes = client.directions(coords, profile='driving-car', optimize_waypoints=True)
    return routes