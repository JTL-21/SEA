from ..db import db
from argon2 import PasswordHasher

ph = PasswordHasher()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.VARCHAR(length=32), unique=True, nullable=False)
    password = db.Column(db.VARCHAR(length=100), unique=False, nullable=False)
    is_admin = db.Column(db.Boolean, default=False)

    @staticmethod
    def hash_password(password: str) -> str:
        return ph.hash(password)
