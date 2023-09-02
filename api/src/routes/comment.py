from flask import request, abort, make_response
from .. import app
from ..models import Ticket, Comment, User
from ..db import db
from ..validation.comment import create_comment_schema
from ..validation.utils import item_getter, validate_body
from flask_login import login_required, current_user


@app.get("/api/ticket/<slug>/comments")
@login_required
def get_ticket_comments(slug):
    """
    Get all comments on a given ticket from its slug

    path: slug
    """

    ticket = Ticket.from_slug(slug)

    comments = Comment.query.filter_by(
        ticket_project=ticket.project, ticket_id=ticket.id
    ).all()

    comment_dicts = []
    for comment in comments:
        comment_dicts.append(comment.as_dict())

    return comment_dicts


@app.post("/api/ticket/<slug>/comment")
@login_required
@validate_body(create_comment_schema)
def create_ticket_comment(slug):
    """
    Create a comment on a given ticket from its slug

    path: slug
    body: text, author
    """

    ticket = Ticket.from_slug(slug)

    text = item_getter("text")(request.json)

    new_comment = Comment(
        text=text.strip(),
        author=current_user.username,
        ticket_project=ticket.project,
        ticket_id=ticket.id,
    )

    db.session.add(new_comment)
    db.session.commit()

    return new_comment.as_dict()


@app.delete("/api/comment/<id>")
@login_required
def delete_comment(id):
    """
    Delete a comment on a ticket by its id

    path: id
    """

    comment = Comment.query.filter_by(id=id).first()

    if not comment:
        abort(404, "No comment with the given id exists")

    if current_user.username != comment.author and not current_user.is_admin:
        abort(403, "You do not have permission to delete this comment")

    db.session.delete(comment)
    db.session.commit()

    return make_response("{}", 204)
