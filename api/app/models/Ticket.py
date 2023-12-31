import re
from flask import abort
from datetime import datetime
from typing import List
from app.models.Project import Project
from app.models.User import User
from app.models.Comment import Comment
from app.extensions import db
from app.utils.list import model_list_as_dict


class Ticket(db.Model):
    """
    Ticket model for Kong API.

    Defines the Ticket model for the Kong API. A Ticket contains many comments and
    is authored by a User.
    """

    id = db.Column(db.Integer, primary_key=True)
    project = db.Column(
        db.VARCHAR(3),
        db.ForeignKey("project.key", ondelete="CASCADE"),
        primary_key=True,
        nullable=False,
    )
    title = db.Column(db.VARCHAR(length=64), unique=False, nullable=False)
    description = db.Column(db.VARCHAR(length=2000), default="", nullable=False)
    author = db.Column(
        db.VARCHAR(32),
        db.ForeignKey("user.username", ondelete="CASCADE"),
        nullable=False,
    )
    assignee = db.Column(
        db.VARCHAR(32),
        db.ForeignKey("user.username", ondelete="SET NULL"),
        nullable=True,
    )
    status = db.Column(
        db.VARCHAR(length=16), unique=False, nullable=False, default="WAITING"
    )
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    points = db.Column(db.Integer, default=1, nullable=False)
    priority = db.Column(db.VARCHAR(9), default="MEDIUM", nullable=False)

    @staticmethod
    def from_slug(slug: str) -> "Ticket":
        """
        Take a ticket slug like ABC-123 and return the corresponding ticket
        """

        if not re.match(r"^[A-Za-z]{3}-[0-9]+$", slug):
            abort(400, "Ticket slug did not match the expected format.")

        # Split ABC and 123
        [project, key] = slug.split("-")

        upper_project_key = project.upper().strip()
        format_key = key.strip()

        project = Project.query.filter_by(key=upper_project_key).first()

        if not project:
            abort(404, "No project with the given key exists")

        ticket = Ticket.query.filter_by(project=project.key, id=format_key).first()
        if not ticket:
            abort(404, "No ticket with the given slug exists")

        return ticket

    def get_comments(self) -> List[Comment]:
        comments = Comment.query.filter_by(
            ticket_project=self.project, ticket_id=self.id
        ).all()

        return comments

    def as_dict(self) -> dict:
        project = Project.query.filter_by(key=self.project).first()
        author = User.query.filter_by(username=self.author).first()
        assignee = User.query.filter_by(username=self.assignee).first()
        comments = self.get_comments()

        return {
            "id": self.id,
            "project": project.as_dict(),
            "title": self.title,
            "description": self.description,
            "status": self.status,
            "author": author.as_dict(),
            "slug": f"{project.key}-{self.id}",
            "created_at": self.created_at.isoformat(),
            "points": self.points,
            "priority": self.priority,
            "assignee": assignee.as_dict() if assignee else None,
            "comments": model_list_as_dict(comments),
        }
