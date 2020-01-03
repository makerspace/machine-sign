import sqlite3
from sqlite3 import Error
from flask import Flask, g, abort, request, jsonify
import os
import json
from datetime import datetime

app = Flask(__name__, static_folder=os.path.abspath("dist"), static_url_path="/static")

DATABASE = "database.sqlite"

def initialize_database(conn):
    init_sql = """
-- projects table
CREATE TABLE IF NOT EXISTS signs (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    last_edited TEXT,
    data BLOB
);
    """
    c = conn.cursor()
    c.execute(init_sql)

def create_connection(db_file):
    """ create a database connection to a SQLite database """
    conn = sqlite3.connect(db_file)
    print(sqlite3.version)
    return conn


def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
    return db

@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

@app.route('/')
def index():
    return app.send_static_file("index.html")

@app.route('/<int:id>')
def view_sign(id: int):
    return app.send_static_file("index.html")

@app.route('/data/signs', methods=["GET"])
def list_signs():
    c = get_db().cursor()
    c.execute("SELECT id, name from signs")
    return jsonify({
        "status": "ok",
        "data": [{ "id": v[0], "name": v[1] } for v in c.fetchall()]
    })

@app.route('/data/signs/<int:id>', methods=["GET"])
def sign(id: int):
    c = get_db().cursor()
    c.execute("SELECT id, name, last_edited, data from signs where id=?", (id,))
    res = c.fetchone()
    if res is None:
        abort(404)

    try:
        jsondata = json.loads(res[3])
    except:
        print("Could not deserialize json data in database\n", res[2])
        abort(500)

    return jsonify({
        "status": "ok",
        "data": {
            "id": res[0],
            "name": res[1],
            "last_edited": res[2],
            "data": jsondata
        }
    })

@app.route('/data/signs', methods=["POST"])
def sign_create():
    conn = get_db()
    c = conn.cursor()

    req_data = request.get_json()
    try:
        name = req_data["name"]
    except:
        abort(400)

    c.execute("INSERT INTO signs (name, last_edited, data) VALUES(?,?,?)", (name, datetime.now(), json.dumps(req_data)))
    conn.commit()
    return sign(c.lastrowid)

@app.route('/data/signs/<int:id>', methods=["POST"])
def sign_update(id: int):
    conn = get_db()
    c = conn.cursor()
    c.execute("SELECT id, name, last_edited, data from signs where id=?", (id,))
    res = c.fetchone()
    if res is None:
        abort(404)

    req_data = request.get_json()
    try:
        name = req_data["name"]
    except:
        abort(400)

    c.execute("UPDATE signs SET name=?, last_edited=?, data=? where id=?", (name, datetime.now(), json.dumps(req_data), id))
    conn.commit()
    return sign(id)

if __name__ == '__main__':
    with app.app_context():
        initialize_database(get_db())
    
    app.run(debug=True)