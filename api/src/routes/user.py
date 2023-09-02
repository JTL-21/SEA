from flask import request, abort
from .. import app
from ..models import User
from ..db import db
from ..validation.user import create_user_schema
from ..validation.utils import item_getter, validate_body


@app.get("/api/user")
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
