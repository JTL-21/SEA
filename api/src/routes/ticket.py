from flask import request, abort
from .. import app
from ..models import Ticket, Project, User
from ..db import db
from ..validation.ticket import validate_create_ticket
from ..utils.json import item_getter


@app.get("/api/ticket/<key>")
def get_ticket(key):
    (is_valid_key, response) = Ticket.from_key(key)

    if not is_valid_key:
        return response

    return response.as_dict()


@app.post("/api/ticket")
def create_ticket():
    is_valid, data_or_error = item_getter(
        ["project", "title", "author"], ["description"]
    )(request.json)

    if not is_valid:
        return data_or_error

    project, title, author, description = data_or_error

    stripped_title = title.strip()
    stripped_description = (description or "").strip()

    validation_pass, validation_fail_reason = validate_create_ticket(
        stripped_title, stripped_description
    )
    if not validation_pass:
        return abort(400, validation_fail_reason)

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
    project = Project.query.filter_by(key=project_key).first()
    if not project:
        return abort(404, "No project with the given key exists")

    tickets = Ticket.query.filter_by(project=project.key).all()

    ticket_dicts = []
    for ticket in tickets:
        ticket_dicts.append(ticket.as_dict())

    return ticket_dicts
