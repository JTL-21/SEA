from flask import request, abort
from .. import app
from ..models import Ticket, Comment, User
from ..db import db
from ..validation.comment import validate_comment_text
from ..utils.json import item_getter


@app.get("/api/ticket/<key>/comments")
def get_ticket_comments(key):
    (is_valid, response) = Ticket.from_key(key)

    if not is_valid:
        return response

    ticket = response
    comments = Comment.query.filter_by(
        ticket_project=ticket.project, ticket_id=ticket.id
    ).all()

    comment_dicts = []
    for comment in comments:
        comment_dicts.append(comment.as_dict())

    return comment_dicts


@app.post("/api/ticket/<key>/comment")
def create_ticket_comment(key):
    (is_valid_key, response) = Ticket.from_key(key)

    if not is_valid_key:
        return response

    ticket = response

    is_valid, data_or_error = item_getter(["text", "author"])(request.json)

    if not is_valid:
        return data_or_error

    text, author = data_or_error

    stripped_text = text.strip()

    is_text_valid, text_fail_reason = validate_comment_text(stripped_text)
    if not is_text_valid:
        return abort(400, text_fail_reason)

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
