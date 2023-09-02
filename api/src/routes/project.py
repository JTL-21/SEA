from operator import itemgetter
from flask import request, abort
from .. import app
from ..models import Project, User, Ticket
from ..db import db
from ..validation.project import validate_create_project


@app.get("/api/project")
def get_all_projects():
    projects = Project.query.all()

    project_dicts = []
    for project in projects:
        project_dicts.append(project.as_dict())

    return project_dicts


@app.get("/api/project/<key>")
def get_project(key):
    project = Project.query.filter_by(key=key).first()

    if not project:
        return abort(404, "No project with the given key exists")

    return project.as_dict()


@app.post("/api/project")
def create_project():
    key, title, owner = itemgetter("key", "title", "owner")(request.json)

    upper_key = key.upper().strip()
    stripped_title = title.strip()

    validation_pass, validation_fail_reason = validate_create_project(
        upper_key, stripped_title
    )
    if not validation_pass:
        return abort(400, validation_fail_reason)

    existing_project = Project.query.filter_by(key=upper_key).first()
    if existing_project:
        return abort(409, f"Project key {upper_key} is already in use")

    user = User.query.filter_by(username=owner.strip()).first()

    if not user:
        return abort(404, "No user with the given username exists")

    new_project = Project(key=upper_key, title=stripped_title, owner=user.username)

    db.session.add(new_project)
    db.session.commit()

    return new_project.as_dict()
