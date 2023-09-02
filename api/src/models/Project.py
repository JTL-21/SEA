from ..db import db
from .User import User
from datetime import datetime


class Project(db.Model):
    key = db.Column(db.VARCHAR(length=3), primary_key=True)
    title = db.Column(db.VARCHAR(length=64), unique=False, nullable=False)
    description = db.Column(db.VARCHAR(length=2000), default="", nullable=False)
    owner = db.Column(
        db.VARCHAR(32),
        db.ForeignKey("user.username", ondelete="CASCADE"),
        nullable=False,
    )
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    tickets = db.relationship("Ticket", backref="Project")

    def as_dict(self):
        owner = User.query.filter_by(username=self.owner).first()

        return {
            "key": self.key,
            "title": self.title,
            "description": self.description,
            "owner": owner.as_dict(),
            "created_at": self.created_at.isoformat(),
        }
