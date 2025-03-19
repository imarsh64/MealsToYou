import mysql
import mysql.connector
from flask import Flask, jsonify

from flask_server.maps import generate_google_maps_link
from flask_server.tsp import make_distance_matrix, genetic_tsp

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
    addresses = [(float(row[0]), float(row[1])) for row in addresses]

    try:
        tsp = genetic_tsp(addresses)
    except:
        return jsonify("OSRM issue"), 400

    ordered = [addresses[i] for i in tsp]
    return generate_google_maps_link(*ordered)


if __name__ == "__main__":
    app.run()
