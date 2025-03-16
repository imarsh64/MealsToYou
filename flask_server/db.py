import mysql.connector

_conn = None
_cursor = None

def connect_db():
    try:
        global _conn, _cursor
        _conn = mysql.connector.connect(
            host="localhost",
            user="root",
            password="password",
            database="meals_to_you"
        )
        _cursor = _conn.cursor()
        _cursor.execute("SELECT 1")
        print("Connected to MySQL")
    except mysql.connector.Error as err:
        print("Failed to connect to MySQL: {}".format(err))

def test_db():
    global _conn, _cursor
    print(_cursor.execute("SELECT * FROM district").fetchall())

