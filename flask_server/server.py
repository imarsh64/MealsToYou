from flask import Flask

app = Flask(__name__)

@app.route("/hi")
def hi():
    return {"hi": ["howdy","helloge!"]}


if __name__ == "__main__":
    app.run()
