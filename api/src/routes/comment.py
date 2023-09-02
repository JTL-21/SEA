from flask import request, abort, make_response
from .. import app
from ..models import Ticket, Comment, User
from ..db import db
from ..validation.comment import create_comment_schema
from ..validation.utils import item_getter, validate_body


@app.get("/api/ticket/<slug>/comments")
def get_ticket_comments(slug):
    """
    Get all comments on a given ticket from its slug

    path: slug
    """

    (is_valid_slug, ticket_or_error) = Ticket.from_slug(slug)

    if not is_valid_slug:
        return ticket_or_error

    ticket = ticket_or_error
    comments = Comment.query.filter_by(
        ticket_project=ticket.project, ticket_id=ticket.id
    ).all()

    comment_dicts = []
    for comment in comments:
        comment_dicts.append(comment.as_dict())

    return comment_dicts


@app.post("/api/ticket/<slug>/comment")
@validate_body(create_comment_schema)
def create_ticket_comment(slug):
    """
    Create a comment on a given ticket from its slug

    path: slug
    body: text, author
    """

    (is_valid_slug, ticket_or_error) = Ticket.from_slug(slug)

    if not is_valid_slug:
        return ticket_or_error

    ticket = ticket_or_error

    text, author = item_getter("text", "author")(request.json)

    stripped_text = text.strip()

    user = User.query.filter_by(username=author).first()
    if not user:
        return (404, "No user with the given username exists")

    new_comment = Comment(
        text=stripped_text,
        author=user.username,
        ticket_project=ticket.project,
        ticket_id=ticket.id,
    )

    db.session.add(new_comment)
    db.session.commit()

    return new_comment.as_dict()


@app.delete("/api/comment/<id>")
def delete_comment(id):
    """
    Delete a comment on a ticket by its id

    path: id
    """
    comment = Comment.query.filter_by(id=id).first()

    if not comment:
        return abort(404, "No comment with the given id exists")

    db.session.delete(comment)
    db.session.commit()

    return make_response("", 204)
