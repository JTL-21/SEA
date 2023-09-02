from ..db import db
from .Project import Project
from .User import User
from flask import abort
from datetime import datetime
from ..validation.ticket import create_ticket_schema
import re


class Ticket(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    project = db.Column(
        db.VARCHAR(3), db.ForeignKey("project.key"), primary_key=True, nullable=False
    )
    title = db.Column(db.VARCHAR(length=64), unique=False, nullable=False)
    description = db.Column(db.VARCHAR(length=512), default="", nullable=False)
    author = db.Column(db.VARCHAR(32), db.ForeignKey("user.username"), nullable=False)
    status = db.Column(
        db.VARCHAR(length=16), unique=False, nullable=False, default="OPEN"
    )
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    comments = db.relationship(
        "Comment",
        backref="Ticket",
        cascade="all, delete-orphan",
        primaryjoin="and_(Ticket.project==Comment.ticket_project, Ticket.id==Comment.ticket_id)",
    )

    @staticmethod
    def from_slug(slug: str):
        """
        Take a ticket slug like ABC-123 and return the corresponding ticket
        """

        if not re.match(r"^[A-Za-z]{3}-[0-9]+$", slug):
            return (False, abort(400, "Ticket slug did not match the expected format."))

        # Split ABC and 123
        [project, key] = slug.split("-")

        upper_project_key = project.upper().strip()
        format_key = key.strip()

        project = Project.query.filter_by(key=upper_project_key).first()

        if not project:
            return (False, abort(404, "No project with the given key exists"))

        ticket = Ticket.query.filter_by(project=project.key, id=format_key).first()
        if not ticket:
            return (False, abort(404, "No ticket with the given slug exists"))

        return (True, ticket)

    def as_dict(self):
        project = Project.query.filter_by(key=self.project).first()
        author = User.query.filter_by(username=self.author).first()

        return {
            "id": self.id,
            "project": project.as_dict(),
            "title": self.title,
            "description": self.description,
            "status": self.status,
            "author": author.as_dict(),
            "slug": f"{project.key}-{self.id}",
            "created_at": self.created_at.isoformat(),
        }
