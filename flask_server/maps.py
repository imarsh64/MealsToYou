

# Generate google maps link
def generate_google_maps_link(*addresses):
    google_maps_link = 'https://www.google.com/maps/dir/'
    # formatted_addresses = [addr.replace(" ", "+") for addr in addresses]
    # formatted_coords = [f"{lat},{lon}" for lon, lat in addresses]
    formatted_coords = [f"{lat},{lon}" for lat, lon in addresses]
    return google_maps_link + "/".join(formatted_coords)
