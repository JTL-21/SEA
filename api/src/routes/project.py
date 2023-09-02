from flask import request, abort, make_response
from flask_login import login_required, current_user
from sqlalchemy import or_
from .. import app
from ..db import db
from ..models import Project, User
from ..validation.project import create_project_schema, edit_project_schema
from ..validation.utils import item_getter, validate_body
from ..utils.list import model_list_as_dict


@app.get("/api/project")
@login_required
def query_projects():
    """
    Find projects based on their name or key similarity to a query passed from a query parameter

    query: query
    """

    query = request.args.get("query", "")

    if not query:
        abort(400, "Query not provided")

    search_term = f"%{query}%"

    similar_projects = Project.query.filter(
        or_(Project.key.ilike(search_term), Project.title.ilike(search_term))
    ).all()

    project_dicts = model_list_as_dict(similar_projects)

    return project_dicts


@app.get("/api/project/<key>")
@login_required
def get_project(key):
    """
    Get a project from its key

    path: key
    """

    project = Project.query.filter_by(key=key).first()

    if not project:
        abort(404, "No project with the given key exists")

    return project.as_dict()


@app.patch("/api/project/<key>")
@login_required
@validate_body(edit_project_schema)
def edit_project(key):
    """
    Update a project from its key

    path: key
    body: title? description?
    """

    project = Project.query.filter_by(key=key).first()

    if not project:
        abort(404, "No project with the given key exists")

    if current_user.username != project.owner and not current_user.is_admin:
        abort(403, "You do not have permission to edit this project")

    title, description = item_getter("title", "description")(request.json)

    project.title = title or ticket.title
    project.description = description or project.description

    db.session.commit()

    return project.as_dict()


@app.delete("/api/project/<key>")
@login_required
def delete_project(key):
    """
    Delete a project from its key

    path: key
    """

    project = Project.query.filter_by(key=key).first()

    if not project:
        abort(404, "No project with the given key exists")

    if current_user.username != project.owner and not current_user.is_admin:
        abort(403, "You do not have permission to delete this project")

    db.session.delete(project)
    db.session.commit()

    return make_response("{}", 204)


@app.post("/api/project")
@login_required
@validate_body(create_project_schema)
def create_project():
    """
    Create a new project

    body: key, title, owner, description?
    """

    key, title, description = item_getter("key", "title", "description")(request.json)

    upper_key = key.upper().strip()
    stripped_title = title.strip()
    stripped_description = (description or "").strip()

    existing_project = Project.query.filter_by(key=upper_key).first()

    if existing_project:
        abort(409, f"Project key {upper_key} is already in use")

    new_project = Project(
        key=upper_key,
        title=stripped_title,
        owner=current_user.username,
        description=stripped_description,
    )

    db.session.add(new_project)
    db.session.commit()

    return new_project.as_dict()
