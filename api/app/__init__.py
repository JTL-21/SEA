import os
import logging
from typing import Tuple
from flask import Flask
from flask_cors import CORS
from werkzeug.exceptions import HTTPException
from app.models import User
from app.routes import comment_bp, project_bp, ticket_bp, user_bp, system_bp
from app.extensions import db, login_manager
from app.config import Config


def create_app(config: Config = Config()):
    """
    Flask app factory to create a Kong API application.

    This function initializes and configures a Flask application for the Kong API,
    registering blueprints, setting up the database, login manager, and handling errors.

    Args:
        config (Config, optional): Configuration object for the Flask app.

    Returns:
        Flask: The configured Flask application for the Kong API.
    """
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
            logging.error("HTTP Error %s: %s", str(code), str(error))

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
    """
    User loader function for Flask-Login.

    This function is used by Flask-Login to load a user object based on the provided username.
    It queries the database for a user with the given username and returns the corresponding
    User object.

    Args:
        username (str): The username of the user to be loaded.

    Returns:
        User: The User object representing the user with the specified username.
    """

    return User.query.filter_by(username=username).first()
