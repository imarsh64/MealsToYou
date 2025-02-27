import os

import openrouteservice
from openrouteservice.directions import directions

# Returns a list of coordinates in the optimal order
def optimize(coords):
    client = openrouteservice.Client(key=os.getenv('ORS_KEY'))
    # routes = client.directions(coords, profile='driving-car', optimize_waypoints=True)
    routes = directions(client, coords, profile='driving-car', optimize_waypoints=True, units='mi')

    optimized_waypoints = routes['routes'][0]['way_points']
    optimized_order = sorted(range(len(optimized_waypoints)), key=lambda k: optimized_waypoints[k])
    optimized_coords = [coords[i] for i in optimized_order]
    return optimized_coords