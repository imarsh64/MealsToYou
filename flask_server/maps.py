# Optimal path
import requests

OSRM_URL = "http://router.project-osrm.org/route/v1/driving/"


def get_osrm_route(locations):
    if len(locations) < 2:
        print("Skipping OSRM request: Route must have at least 2 points.")
        return None

    coord_string = ";".join([f"{lon},{lat}" for lat, lon in locations])
    response = requests.get(f"{OSRM_URL}{coord_string}?overview=full&geometries=geojson")

    if response.status_code == 200 and "routes" in response.json() and response.json()["routes"]:
        return response.json()["routes"][0]["geometry"]["coordinates"]
    else:
        print(f"OSRM request failed: {response.status_code}")
        return None


# Generate google maps link
def generate_google_maps_link(*addresses):
    google_maps_link = 'https://www.google.com/maps/dir/'
    formatted_addresses = [addr.replace(" ", "+") for addr in addresses]
    return google_maps_link + "/".join(formatted_addresses)
