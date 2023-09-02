from flask import Blueprint, request, abort, make_response
from flask_login import login_required, current_user
from app.extensions import db
from app.models import Ticket, Project, User, Comment
from app.models.Ticket import Ticket
from app.models.User import User
from app.models.Comment import Comment
from app.models.Project import Project
from app.validation.ticket import create_ticket_schema, edit_ticket_schema
from app.validation.utils import validate_body
from app.utils.input import item_getter
from app.utils.list import model_list_as_dict

ticket_bp = Blueprint("ticket", __name__)


@ticket_bp.get("/api/ticket/<slug>")
@login_required
def get_ticket(slug):
    """
    Get a ticket from its slug

    path: slug
    """

    ticket = Ticket.from_slug(slug)
    comments = ticket.get_comments()

    comment_dicts = model_list_as_dict(comments)

    return {**ticket.as_dict(), "comments": comment_dicts}


@ticket_bp.patch("/api/ticket/<slug>")
@login_required
@validate_body(edit_ticket_schema)
def edit_ticket(slug):
    """
    Edit a ticket from its slug

    path: slug
    body: title? description?
    """

    ticket = Ticket.from_slug(slug)

    title, description, status, priority, points, assignee = item_getter(
        "title", "description", "status", "priority", "points", "assignee"
    )(request.json)

    if assignee:
        user = User.query.filter_by(username=assignee).first()
        if not user:
            abort(
                404,
            )
        ticket.assignee = user.username

    ticket.title = title or ticket.title
    ticket.description = description or ticket.description
    ticket.status = status or ticket.status
    ticket.priority = priority or ticket.priority
    ticket.points = points or ticket.points

    db.session.commit()

    return ticket.as_dict()


@ticket_bp.delete("/api/ticket/<slug>")
@login_required
def delete_ticket(slug):
    """
    Delete a ticket from its slug

    path: slug
    """

    ticket = Ticket.from_slug(slug)

    db.session.delete(ticket)
    db.session.commit()

    return make_response("{}", 204)


@ticket_bp.post("/api/ticket")
@login_required
@validate_body(create_ticket_schema)
def create_ticket():
    """
    Create a new ticket in a given project

    body: project, title, description?
    """

    project, title, description, priority, points = item_getter(
        "project", "title", "description", "priority", "points"
    )(request.json)

    stripped_title = title.strip()
    stripped_description = (description or "").strip()

    project = Project.query.filter_by(key=project).first()

    if not project:
        abort(404, "No project with the given key exists")

    new_ticket = Ticket(
        id=project.ticket_counter,
        project=project.key,
        author=current_user.username,
        title=stripped_title,
        description=stripped_description,
        priority=priority,
        points=points,
    )

    project.ticket_counter += 1

    db.session.add(new_ticket)
    db.session.commit()

    return new_ticket.as_dict()


@ticket_bp.get("/api/project/<project_key>/tickets")
@login_required
def get_project_tickets(project_key):
    """
    Get all tickets within a given project

    path: project_key
    """

    project = Project.query.filter_by(key=project_key).first()
    if not project:
        abort(404, "No project with the given key exists")

    tickets = project.get_tickets()

    ticket_dicts = model_list_as_dict(tickets)

    return ticket_dicts
