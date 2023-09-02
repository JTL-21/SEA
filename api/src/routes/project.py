from flask import request, abort, make_response
from .. import app
from ..models import Project, User
from ..db import db
from ..validation.project import create_project_schema, edit_project_schema
from ..validation.utils import item_getter, validate_body


@app.get("/api/project")
def get_all_projects():
    """
    Get all projects
    """

    projects = Project.query.all()

    project_dicts = []
    for project in projects:
        project_dicts.append(project.as_dict())

    return project_dicts


@app.get("/api/project/<key>")
def get_project(key):
    """
    Get a project from its key

    path: key
    """

    project = Project.query.filter_by(key=key).first()

    if not project:
        return abort(404, "No project with the given key exists")

    return project.as_dict()


@app.patch("/api/project/<key>")
@validate_body(edit_project_schema)
def edit_project(key):
    """
    Update a project from its key

    path: key
    body: title? description?
    """

    project = Project.query.filter_by(key=key).first()

    if not project:
        return abort(404, "No project with the given key exists")

    title, description = item_getter("title", "description")(request.json)

    project.title = title or ticket.title
    project.description = description or project.description

    db.session.commit()

    return project.as_dict()


@app.delete("/api/project/<key>")
def delete_project(key):
    """
    Delete a project from its key

    path: key
    """

    project = Project.query.filter_by(key=key).first()

    if not project:
        return abort(404, "No project with the given key exists")

    db.session.delete(project)
    db.session.commit()

    return make_response("", 204)


@app.post("/api/project")
@validate_body(create_project_schema)
def create_project():
    """
    Create a new project

    body: key, title, owner, description?
    """

    key, title, description, owner = item_getter(
        "key", "title", "description", "owner"
    )(request.json)

    upper_key = key.upper().strip()
    stripped_title = title.strip()
    stripped_description = (description or "").strip()

    existing_project = Project.query.filter_by(key=upper_key).first()
    if existing_project:
        return abort(409, f"Project key {upper_key} is already in use")

    user = User.query.filter_by(username=owner.strip()).first()

    if not user:
        return abort(404, "No user with the given username exists")

    new_project = Project(
        key=upper_key,
        title=stripped_title,
        owner=user.username,
        description=stripped_description,
    )

    db.session.add(new_project)
    db.session.commit()

    return new_project.as_dict()
