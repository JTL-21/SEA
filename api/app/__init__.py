import os
import logging
from dotenv import load_dotenv
from flask import Flask, send_from_directory
from flask_cors import CORS
from werkzeug.exceptions import HTTPException
from app.models import User, Project, Ticket, Comment
from flask_sqlalchemy import SQLAlchemy
from app.routes import comment_bp, project_bp, ticket_bp, user_bp
from app.extensions import db, login_manager

load_dotenv()


def create_app():
    app = Flask(__name__)

    app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("SQLALCHEMY_DATABASE_URI")
    app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY")

    app.register_blueprint(comment_bp)
    app.register_blueprint(project_bp)
    app.register_blueprint(ticket_bp)
    app.register_blueprint(user_bp)

    login_manager.init_app(app)
    CORS(app, supports_credentials=True)

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

        return {"message": desc}, code

    @app.route("/static/<path:path>")
    def static_route(path):
        return send_from_directory("static", path)

    logging.basicConfig(
        level=os.environ.get("LOG_LEVEL", "INFO").upper(),
        format="%(asctime)s %(levelname)s %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
        handlers=[logging.FileHandler("app.log"), logging.StreamHandler()],
    )

    logging.info("API Started")

    return app


@login_manager.user_loader
def load_user(username):
    return User.query.filter_by(username=username).first()
