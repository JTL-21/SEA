"""
Generates a single mock.json file from various other data files
"""


import json
from random import randint, choice, random

priorities = ["VERY_LOW", "LOW", "MEDIUM", "HIGH", "VERY_HIGH"]
status = ["WAITING", "IN_PROGRESS", "IN_TEST", "DONE"]


hashed_pword = "$argon2id$v=19$m=65536,t=3,p=4$3jTah+NKnD1w+Op5SYHvhw$6pe0OSn34EEPouzx82ggsmZq5mapesFkbPQyJgOmS8g"


def load_json(file):
    return json.loads(
        open(file if file.endswith(".json") else f"{file}.json", "r").read()
    )


users = load_json("users")
projects = load_json("projects")
comments = load_json("comments")


def generate_random():
    mock_data = {"users": [], "projects": [], "tickets": [], "comments": []}

    for user in users:
        mock_data["users"].append({"username": user, "password": hashed_pword})

    for project in projects:
        mock_data["projects"].append(
            {
                "key": project["key"],
                "title": project["title"],
                "description": project["description"],
                "owner": choice(users),
            }
        )

        for ticket_index, ticket in enumerate(project["tickets"], start=1):
            mock_data["tickets"].append(
                {
                    "id": ticket_index,
                    "project": project["key"],
                    "title": ticket["title"],
                    "description": ticket["description"],
                    "priority": choice(priorities),
                    "points": randint(1, 9),
                    "author": choice(users),
                    "assignee": choice(users) if random() > 0.7 else None,
                    "status": choice(status),
                }
            )

            for i in range(randint(0, 5)):
                mock_data["comments"].append(
                    {
                        "text": choice(comments),
                        "author": choice(users),
                        "ticket_project": project["key"],
                        "ticket_id": ticket_index,
                    }
                )

    return mock_data


if __name__ == "__main__":
    mock = generate_random()
    with open("mock.json", "w") as f:
        f.write(json.dumps(mock))
