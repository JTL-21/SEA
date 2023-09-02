from operator import itemgetter
from flask import request, abort
from .. import app
from ..models import User
from ..db import db


@app.get("/api/user/<username>")
def get_user(username):
    """
    Get user from username
    """
    user = User.query.filter_by(username=username).first()

    return { "username": user.username }


@app.post("/api/user")
def create_user():
    """
    Create a user with a given username and password
    """
    username, password = itemgetter("username", "password")(request.json)

    existing_user = User.query.filter_by(username=username).first()
    if existing_user:
        return abort(409, "Username taken")

    password_hash = User.hash_password(password)

    new_user = User(username=username, password=password_hash)
    db.session.add(new_user)
    db.session.commit()

    return {"username": username, "id": new_user.id}
