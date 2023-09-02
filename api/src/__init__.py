import os
from flask import Flask, send_from_directory
from .db import db
from dotenv import load_dotenv
from .models import *
import logging
from werkzeug.exceptions import HTTPException

load_dotenv()

app = Flask(__name__)

app.config["SQLALCHEMY_DATABASE_URI"] = os.environ["SQLALCHEMY_DATABASE_URI"]
db.init_app(app)

with app.app_context():
    db.create_all()


@app.errorhandler(Exception)
def handle_error(error):
    code = getattr(error, "code", 500)
    desc = getattr(error, "description", "Unexpected error")

    if not isinstance(error, HTTPException):
        # Only log actual errors
        logging.error(f"HTTP Error ${code}", str(error))

    return {"code": code, "message": desc}, code


@app.route("/static/<path:path>")
def send_report(path):
    return send_from_directory("static", path)


from .routes import *
