import mysql
from flask import Flask, jsonify, request
import mysql.connector

app = Flask(__name__)


mydb = mysql.connector.connect(
  host="",
  port="",
  database="",
  user="",
  password= ""
)


@app.route("/hi")
def hi():
    return {"hi": ["howdy","helloge!"]}


@app.route("/login", methods = ['POST'])
def login():
    #future functionality: receives username/psw, chcks against db
    #if can find corresponding data, return a true
    content = request.get_json()
    uname = content.get('username')
    pword = content.get('password')
    # cursor = mydb.cursor()
    # cursor.execute("SELECT * FROM USER WHERE")
    # result = cursor.fetchall()

    print(uname, pword)
    response = True
    return jsonify({"data": response})


@app.route("/get_addr", methods = ['POST'])
def get_addr():
    #get list of addresses based on district
    #parse
    district = request.get_json().get("district")
    #district = 1
    #print(district)
    cursor = mydb.cursor()
    cursor.execute("""SELECT * FROM address WHERE district=%s""", [str(district)])
    result = cursor.fetchall()
    #print(result)
    return jsonify({"data": result})


@app.route("/upload_addr", methods = ['POST'])
def upload_addr():
    #submit an address to the DB
    #should we allow duplicates?
    #parse
    content = request.get_json()
    district = content.get("district")
    street = content.get("street")
    city = content.get("city")
    zipcode = content.get("zip")
    address_state = content.get("state")
    #data validation, throw error if empty fields
    cursor = mydb.cursor()
    cursor.execute("""INSERT INTO address (district, street, city, zipcode, address_state) VALUES (%s, %s, %s, %s, %s)""", [str(district),street,city,zipcode,address_state])
    mydb.commit()
    response = 1
    #TODO: if any errors, return 0
    return jsonify({"data": response})


@app.route("/remove_addr", methods = ['POST'])
def remove_addr():
    #send a pip to remove address
    district = request.get_json().get("district")
    #not functional yet
    #TODO: accss DB and chck for address, remove where =
    response = True
    return jsonify({"data": response})


@app.route("/get_route", methods = ['GET'])
def get_route():
    #pass in a list of addresses to map API. Receive route back
    response = True
    return jsonify({"data": response})


if __name__ == "__main__":
    app.run()
