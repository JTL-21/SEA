from flask import request, abort, make_response
from .. import app
from ..models import Ticket, Project, User
from ..db import db
from ..validation.ticket import create_ticket_schema, edit_ticket_schema
from ..validation.utils import item_getter, validate_body


@app.get("/api/ticket/<slug>")
def get_ticket(slug):
    """
    Get a ticket from its slug

    path: slug
    """

    (is_valid_slug, response) = Ticket.from_slug(slug)

    if not is_valid_slug:
        return response

    return response.as_dict()


@app.patch("/api/ticket/<slug>")
@validate_body(edit_ticket_schema)
def edit_ticket(slug):
    """
    Edit a ticket from its slug

    path: slug
    body: title? description?
    """

    (is_valid_slug, response) = Ticket.from_slug(slug)

    if not is_valid_slug:
        return response

    ticket = response

    title, description, status = item_getter("title", "description", "status")(
        request.json
    )

    ticket.title = title or ticket.title
    ticket.description = description or ticket.description
    ticket.status = status or ticket.status

    db.session.commit()

    return ticket.as_dict()


@app.delete("/api/ticket/<slug>")
def delete_ticket(slug):
    """
    Delete a ticket from its slug

    path: slug
    """

    (is_valid_slug, response) = Ticket.from_slug(slug)

    if not is_valid_slug:
        return response

    ticket = response

    db.session.delete(ticket)
    db.session.commit()

    return make_response("", 204)


@app.post("/api/ticket")
@validate_body(create_ticket_schema)
def create_ticket():
    """
    Create a new ticket in a given project

    body: project, title, author, description?
    """

    project, title, author, description = item_getter(
        "project", "title", "author", "description"
    )(request.json)

    stripped_title = title.strip()
    stripped_description = (description or "").strip()

    project = Project.query.filter_by(key=project).first()
    if not project:
        return abort(404, "No project with the given key exists")

    author = User.query.filter_by(username=author.strip()).first()

    if not author:
        return abort(404, "No user with the given username exists")

    new_ticket = Ticket(
        project=project.key,
        author=author.username,
        title=stripped_title,
        description=stripped_description,
    )
    db.session.add(new_ticket)
    db.session.commit()

    return new_ticket.as_dict()


@app.get("/api/project/<project_key>/tickets")
def get_project_tickets(project_key):
    """
    Get all tickets within a given project

    path: project_key
    """

    project = Project.query.filter_by(key=project_key).first()
    if not project:
        return abort(404, "No project with the given key exists")

    tickets = Ticket.query.filter_by(project=project.key).all()

    ticket_dicts = []
    for ticket in tickets:
        ticket_dicts.append(ticket.as_dict())

    return ticket_dicts
