"""
Loads mock.json into a given database

If ran directly, it loads into the dev database
"""


import json
import logging
from app.models import User, Project, Ticket, Comment
from app import create_app
from app.config import DevConfig
from app.extensions import db

data = json.load(open("mock/mock.json"))


def seed_db(db):
    for user in data["users"]:
        logging.debug(f"Inserting user {user['username']}")
        new_user = User(username=user["username"], password=user["password"])
        db.session.add(new_user)

    db.session.commit()

    for project in data["projects"]:
        logging.debug(f"Inserting project {project['key']}")
        new_project = Project(
            key=project["key"],
            title=project["title"],
            description=project["description"],
            owner=project["owner"],
        )
        db.session.add(new_project)

    db.session.commit()

    for index, ticket in enumerate(data["tickets"]):
        logging.debug(f"Inserting ticket {ticket['project']}-{index}")
        new_ticket = Ticket(
            id=ticket["id"],
            project=ticket["project"],
            title=ticket["title"],
            description=ticket["description"],
            priority=ticket["priority"],
            points=ticket["points"],
            author=ticket["author"],
            assignee=ticket["assignee"],
            status=ticket["status"],
        )
        db.session.add(new_ticket)

    db.session.commit()

    for comment in data["comments"]:
        logging.debug(
            f"Inserting comment in {comment['ticket_project']}-{comment['ticket_id']}"
        )
        new_comment = Comment(
            text=comment["text"],
            author=comment["author"],
            ticket_project=comment["ticket_project"],
            ticket_id=comment["ticket_id"],
        )
        db.session.add(new_comment)

    db.session.commit()


if __name__ == "__main__":
    app = create_app(DevConfig)

    with app.app_context():
        db.create_all()
        seed_db(db)
        db.session.close()
