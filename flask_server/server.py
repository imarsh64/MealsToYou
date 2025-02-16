from flask import Flask

app = Flask(__name__)

@app.route("/hi")
def hi():
    return {"hi": ["howdy","helloge!"]}

@app.route("/login")
def login():
    #future functionality: receives username/psw, chcks against db
    #if can find corresponding data, return a true
    return {True}


if __name__ == "__main__":
    app.run()
