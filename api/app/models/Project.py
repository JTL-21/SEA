from datetime import datetime
from typing import List
from app.models.User import User
from app.extensions import db


class Project(db.Model):
    """
    Project model for Kong API.

    Defines the Project model for the Kong API. A Project contains many tickets
    and is owned by a User.
    """

    key = db.Column(db.VARCHAR(length=3), primary_key=True)
    title = db.Column(db.VARCHAR(length=64), unique=False, nullable=False)
    description = db.Column(db.VARCHAR(length=2000), default="", nullable=False)
    owner = db.Column(
        db.VARCHAR(32),
        db.ForeignKey("user.username", ondelete="CASCADE"),
        nullable=False,
    )
    ticket_counter = db.Column(db.Integer, nullable=False, default=1)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    def get_tickets(self, operator="all") -> List["Ticket"]:
        # Import here to prevent circular import
        from app.models.Ticket import Ticket

        if operator == "count":
            tickets = Ticket.query.filter_by(project=self.key).count()
        else:
            tickets = Ticket.query.filter_by(project=self.key).all()

        return tickets

    def as_dict(self) -> dict:
        owner = User.query.filter_by(username=self.owner).first()
        ticket_count = self.get_tickets(operator="count")

        return {
            "key": self.key,
            "title": self.title,
            "description": self.description,
            "owner": owner.as_dict(),
            "created_at": self.created_at.isoformat(),
            "ticket_count": ticket_count,
        }
