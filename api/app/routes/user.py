import logging
from flask import Blueprint, request, abort, make_response
from flask_login import login_required, login_user, logout_user, current_user
from sqlalchemy import func
from app.extensions import db
from app.models.User import User
from app.validation.user import create_user_schema, login_schema
from app.validation.utils import validate_request
from app.utils.input import item_getter
from app.utils.list import model_list_as_dict

user_bp = Blueprint("user", __name__)


@user_bp.get("/api/user")
@login_required
def query_users():
    """
    Find users based on their username similarity to a username passed from a query parameter

    query: username
    """

    username = request.args.get("username", "")

    if not username:
        abort(400, "Username not provided")

    similar_users = User.query.filter(
        func.lower(User.username).contains(username.lower())
    ).all()

    user_dicts = model_list_as_dict(similar_users)

    return user_dicts


@user_bp.get("/api/user/<username>")
@login_required
def get_user(username):
    """
    Get user from username

    path: username
    """

    user = User.query.filter_by(username=username).first()

    if not user:
        abort(404, "No user with the given username exists")

    return user.as_dict()


@user_bp.post("/api/user")
@validate_request(body_schema=create_user_schema)
def create_user():
    """
    Create a user with a given username and password

    body: username, password
    """

    if current_user.is_authenticated:
        abort(400, "You must logout before you can create a new user")

    username, password = item_getter("username", "password")(request.json)

    stripped_username = username.strip()

    existing_user = User.query.filter_by(username=stripped_username).first()
    if existing_user:
        abort(409, "Username taken")

    password_hash = User.hash_password(password)

    new_user = User(username=stripped_username, password=password_hash)
    db.session.add(new_user)
    db.session.commit()

    return new_user.as_dict()


@user_bp.post("/api/login")
@validate_request(body_schema=login_schema)
def login():
    """
    Log a user in via username and password

    body: username, password
    """

    username, password, stay_signed_in = item_getter(
        "username", "password", "stay_signed_in"
    )(request.json)

    user = User.query.filter_by(username=username).first()

    if not user:
        abort(404, "No user with the given username exists")

    password_match = user.verify_password(password)

    if not password_match:
        abort(401, "Incorrect password")

    login_user(user, remember=bool(stay_signed_in))
    logging.info(f"Successfully logged in as {user.username}")

    return user.as_dict()


@user_bp.post("/api/logout")
@login_required
def logout():
    """
    Log out the current user if they are logged in
    """

    logout_user()
    return make_response("{}", 204)


@user_bp.get("/api/whoami")
@login_required
def whoami():
    """
    Return the currently logged in user
    """

    return current_user.as_dict()
