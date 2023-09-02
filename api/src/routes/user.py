from flask import request, abort, make_response
from .. import app
from ..models import User
from ..db import db
from ..validation.user import create_user_schema, login_schema
from ..validation.utils import item_getter, validate_body
from flask_login import login_required, login_user, logout_user, current_user


@app.get("/api/user")
@login_required
def query_users():
    """
    Find users based on their username similarity to a username passed from a query parameter

    query: username
    """

    username = request.args.get("username", "")

    if not username:
        return abort(400, "Username not provided")

    similar_users = User.query.filter(User.username.ilike(f"%{username}%")).all()

    user_dicts = []
    for user in similar_users:
        user_dicts.append(user.as_dict())

    return user_dicts


@app.get("/api/user/<username>")
@login_required
def get_user(username):
    """
    Get user from username

    path: username
    """

    user = User.query.filter_by(username=username).first()

    if not user:
        return abort(404, "No user with the given username exists")

    return user.as_dict()


@app.post("/api/user")
@validate_body(create_user_schema)
def create_user():
    """
    Create a user with a given username and password

    body: username, password
    """

    if current_user.is_authenticated:
        return abort(400, "You must logout before you can create a new user")

    username, password = item_getter("username", "password")(request.json)

    stripped_username = username.strip()

    existing_user = User.query.filter_by(username=stripped_username).first()
    if existing_user:
        return abort(409, "Username taken")

    password_hash = User.hash_password(password)

    new_user = User(username=stripped_username, password=password_hash)
    db.session.add(new_user)
    db.session.commit()

    return new_user.as_dict()


@app.post("/api/login")
@validate_body(login_schema)
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
        return abort(404, "No user with the given username exists")

    password_match = user.verify_password(password)

    if not password_match:
        return abort(401, "Incorrect username or password")

    login_user(user, remember=bool(stay_signed_in))

    return user.as_dict()


@app.post("/api/logout")
@login_required
def logout():
    """
    Log out the current user if they are logged in
    """

    logout_user()
    return make_response("", 204)


@app.get("/api/whoami")
@login_required
def whoami():
    """
    Return the currently logged in user
    """

    return current_user.as_dict()
