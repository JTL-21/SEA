from datetime import datetime
from flask_login import UserMixin
from argon2 import PasswordHasher, exceptions
from app.extensions import db


ph = PasswordHasher()


class User(UserMixin, db.Model):
    username = db.Column(db.VARCHAR(length=32), primary_key=True)
    password = db.Column(db.VARCHAR(length=100), unique=False, nullable=False)
    is_admin = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    tickets = db.relationship(
        "Ticket",
        backref="User",
        foreign_keys="Ticket.author",
    )
    comments = db.relationship("Comment", backref="User")

    @staticmethod
    def hash_password(password: str) -> str:
        return ph.hash(password)

    def verify_password(self, password: str) -> bool:
        try:
            ph.verify(self.password, password)
            return True
        except exceptions.VerifyMismatchError:
            return False

    def as_dict(self) -> dict:
        return {
            "username": self.username,
            "is_admin": self.is_admin,
            "created_at": self.created_at.isoformat(),
        }

    def get_id(self) -> str:
        return self.username
