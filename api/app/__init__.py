import os
import logging
from typing import Tuple
from flask import Flask
from flask_cors import CORS
from werkzeug.exceptions import HTTPException
from app.models import *
from app.routes import comment_bp, project_bp, ticket_bp, user_bp, system_bp
from app.extensions import db, login_manager
from app.config import Config


def create_app(config: Config = Config()):
    app = Flask(__name__)

    app.config.from_object(config)

    app.register_blueprint(system_bp)
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
    def handle_error(error: Exception) -> Tuple[dict, int]:
        code = getattr(error, "code", 500)
        desc = getattr(error, "description", "Unexpected error")

        if not isinstance(error, HTTPException):
            # Only log actual errors
            logging.error(f"HTTP Error {code}: {str(error)}")

        return {"message": desc}, code

    logging.basicConfig(
        level=os.environ.get("LOG_LEVEL", "INFO").upper(),
        format="%(asctime)s %(levelname)s %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
        handlers=[logging.FileHandler("app.log"), logging.StreamHandler()],
    )

    logging.info("API Started")

    return app


@login_manager.user_loader
def load_user(username: str) -> User:
    return User.query.filter_by(username=username).first()
