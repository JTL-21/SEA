import os
import logging
from dotenv import load_dotenv
from flask import Flask, send_from_directory
from flask_cors import CORS
from flask_login import LoginManager
from werkzeug.exceptions import HTTPException
from .db import db
from .models import User, Project, Ticket, Comment


load_dotenv()

app = Flask(__name__)

app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("SQLALCHEMY_DATABASE_URI")
app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY")

login_manager = LoginManager()
login_manager.init_app(app)
CORS(app, supports_credentials=True)

db.init_app(app)

with app.app_context():
    db.create_all()


@login_manager.user_loader
def load_user(username):
    return User.query.filter_by(username=username).first()


@app.errorhandler(Exception)
def handle_error(error):
    code = getattr(error, "code", 500)
    desc = getattr(error, "description", "Unexpected error")

    if not isinstance(error, HTTPException):
        # Only log actual errors
        logging.error(f"HTTP Error ${code}", str(error))

    return {"message": desc}, code


@app.route("/static/<path:path>")
def static_route(path):
    return send_from_directory("static", path)


def setup() -> None:
    logging.basicConfig(
        level=os.environ.get("LOG_LEVEL", "INFO").upper(),
        format="%(asctime)s %(levelname)s %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
        handlers=[logging.FileHandler("app.log"), logging.StreamHandler()],
    )

    logging.info("API Started")


from .routes import *

setup()
