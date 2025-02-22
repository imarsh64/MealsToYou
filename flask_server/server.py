from flask import Flask, jsonify, request

app = Flask(__name__)

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
    #use these for something
    print(uname, pword)
    response = True
    return jsonify({"data": response})


if __name__ == "__main__":
    app.run()
