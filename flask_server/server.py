import mysql
from flask import Flask, jsonify, request
import mysql.connector


from flask_server.maps import generate_google_maps_link
from flask_server.tsp import make_distance_matrix, genetic_tsp

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

@app.route("/route/<district>")
def route(district):
    cursor = mydb.cursor()
    query = "SELECT latitude, longitude FROM address WHERE district = %s"
    params = district

    cursor.execute(query, (params,))
    addresses = cursor.fetchall()
    addresses = [(float(row[0]), float(row[1])) for row in addresses]

    tsp = genetic_tsp(addresses)

    ordered = [addresses[i] for i in tsp]
    return generate_google_maps_link(*ordered)


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


@app.route("/get_addr", methods = ['GET'])
def get_addr():
    #get list of addresses based on district
    district = request.args.get('district')
    cursor = mydb.cursor()
    cursor.execute("""SELECT * FROM address WHERE district=%s""", [str(district)])
    result = cursor.fetchall()
    #print(result)
    return jsonify({"data": result})

@app.route("/get_all_addr", methods = ['GET'])
def get_all_addr():
    #get list of all addresses 
    cursor = mydb.cursor()
    cursor.execute("""SELECT * FROM address """)
    result = cursor.fetchall()
    return jsonify({"data": result})

@app.route("/get_addr_byId", methods = ['GET'])
def get_addr_byId():
    #get single address by its id
    id = request.args.get('id')
    cursor = mydb.cursor()
    cursor.execute("""SELECT * FROM address WHERE id = '%s'""", [id])
    result = cursor.fetchall()
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
    cursor.execute("""INSERT INTO address (district, street, city, zipcode, address_state) VALUES (%s, %s, %s, %s, %s)""", [int(district),street,city,zipcode,address_state])
    mydb.commit()
    response = 1
    #TODO: if any errors, return 0
    return jsonify({"data": response})


@app.route("/delete_addr", methods = ['DELETE'])
def remove_addr():
    #send a pip to remove address
    content = request.get_json()
    id = content.get("id")

    #data validation, throw error if empty fields
    if not (id):
        return jsonify({"error": "Missing id"}), 400
    
    #query executes
    cursor = mydb.cursor()
    cursor.execute(
        """DELETE FROM address WHERE id=%s""", (id,)
    )
    mydb.commit()

    response = 1
    return jsonify({"data": response})

@app.route("/edit_addr", methods = ['PATCH'])
def edit_route():

    id = request.args.get('id')
    district = request.args.get('district')
    street = request.args.get('street')
    zip_code = request.args.get('zip')
    city = request.args.get('city')
    state = request.args.get('state')
    
    if not id:
        return jsonify({"error": "ID is required"}), 400

    cursor = mydb.cursor()
    sql = """UPDATE address 
                   SET district = %s,
                   street = %s,
                   city = %s,
                   zipcode = %s,
                   address_state = %s
                   WHERE id=%s"""
    
    values = (district, street, city, zip_code, state, id)
    try:
        cursor.execute(sql, values)
        mydb.commit()
        response = {"message": "Address updated successfully"}
    except Exception as e:
        response = {"error": str(e)}
    finally:
        cursor.close()

    return jsonify(response)


@app.route("/get_route", methods = ['GET'])
def get_route():
    #pass in a list of addresses to map API. Receive route back
    response = True
    return jsonify({"data": response})



if __name__ == "__main__":
    app.run()
