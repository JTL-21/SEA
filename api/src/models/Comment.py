from ..db import db
from .User import User
from datetime import datetime


class Comment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.VARCHAR(length=512), unique=False, nullable=False)
    author = db.Column(db.VARCHAR(32), db.ForeignKey("user.username"), nullable=False)
    ticket_project = db.Column(
        db.VARCHAR(3), db.ForeignKey("ticket.project"), nullable=False
    )
    ticket_id = db.Column(db.Integer, db.ForeignKey("ticket.id"), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    def as_dict(self):
        author = User.query.filter_by(username=self.author).first()

        return {
            "id": self.id,
            "text": self.text,
            "author": author.as_dict(),
            "created_at": self.created_at.isoformat(),
        }
