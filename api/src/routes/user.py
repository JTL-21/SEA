from flask import request, abort
from .. import app
from ..models import User
from ..db import db
from ..validation.user import validate_user_username
from ..utils.json import item_getter


@app.get("/api/user")
def query_users():
    username = request.args.get("username", "")

    if not username:
        return abort(400, "Username not provided")

    similar_users = User.query.filter(User.username.ilike(f"%{username}%")).all()

    user_dicts = []
    for user in similar_users:
        user_dicts.append(user.as_dict())

    return user_dicts


@app.get("/api/user/<username>")
def get_user(username):
    """
    Get user from username
    """
    user = User.query.filter_by(username=username).first()

    if not user:
        return abort(404, "No user with the given username exists")

    return user.as_dict()


@app.post("/api/user")
def create_user():
    """
    Create a user with a given username and password
    """
    is_valid, data_or_error = item_getter(["username", "password"])(request.json)

    if not is_valid:
        return data_or_error

    username, password = data_or_error

    stripped_username = username.strip()

    username_valid, username_fail_reason = validate_user_username(stripped_username)
    if not username_valid:
        return abort(400, username_fail_reason)

    existing_user = User.query.filter_by(username=stripped_username).first()
    if existing_user:
        return abort(409, "Username taken")

    password_hash = User.hash_password(password)

    new_user = User(username=stripped_username, password=password_hash)
    db.session.add(new_user)
    db.session.commit()

    return new_user.as_dict()
