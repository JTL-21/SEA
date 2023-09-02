from datetime import datetime
from app.models.User import User
from app.extensions import db


class Comment(db.Model):
    """
    Comment model for Kong API.

    Defines the Comment model for the Kong API. A Comment is authored by a user and
    belongs to a Ticket.
    """

    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.VARCHAR(length=512), unique=False, nullable=False)
    author = db.Column(db.VARCHAR(32), db.ForeignKey("user.username"), nullable=False)
    ticket_project = db.Column(
        db.VARCHAR(3),
        db.ForeignKey("ticket.project", ondelete="CASCADE"),
        nullable=False,
    )
    ticket_id = db.Column(
        db.Integer, db.ForeignKey("ticket.id", ondelete="CASCADE"), nullable=False
    )
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    def as_dict(self) -> dict:
        author = User.query.filter_by(username=self.author).first()

        return {
            "id": self.id,
            "text": self.text,
            "author": author.as_dict(),
            "created_at": self.created_at.isoformat(),
        }
