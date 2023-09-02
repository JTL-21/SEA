from ..db import db
from argon2 import PasswordHasher
from datetime import datetime


ph = PasswordHasher()


class User(db.Model):
    username = db.Column(db.VARCHAR(length=32), primary_key=True)
    password = db.Column(db.VARCHAR(length=100), unique=False, nullable=False)
    is_admin = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    tickets = db.relationship("Ticket", backref="User", cascade="all, delete-orphan")
    comments = db.relationship("Comment", backref="User", cascade="all, delete-orphan")

    @staticmethod
    def hash_password(password: str) -> str:
        return ph.hash(password)

    def as_dict(self):
        return {
            "username": self.username,
            "is_admin": self.is_admin,
            "created_at": self.created_at.isoformat(),
        }
