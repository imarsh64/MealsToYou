import mysql
import mysql.connector
from flask import Flask

from flask_server.maps import get_osrm_route, generate_google_maps_link

app = Flask(__name__)

mydb = mysql.connector.connect(
  host="localhost",
  database="meals_to_you",
  user="root",
  password="password"
)

@app.route("/hi")
def hi():
    return {"hi": ["howdy","helloge!"]}

@app.route("/route/<district>")
def route(district):
    cursor = mydb.cursor()
    query = "SELECT latitude, longitude FROM address WHERE district = %s"
    params = district
    cursor.execute(query, (params,))
    addresses = cursor.fetchall()
    # address_flipped = [tuple(reversed(tup)) for tup in addresses]
    ordered = get_osrm_route(addresses)
    return generate_google_maps_link(*ordered) # generate_google_maps_link(*[list(tup) for tup in address_flipped])


if __name__ == "__main__":
    app.run()
