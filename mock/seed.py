import requests
import json
from random import randint, choice

url = "http://172.29.169.12:5000"
priorities = ["VERY_LOW", "LOW", "MEDIUM", "HIGH", "VERY_HIGH"]
status = ["WAITING", "IN_PROGRESS", "IN_TEST", "DONE"]

user_cookies = {}


def request_data(user=None):
    if user:
        return {
            "headers": {"content-type": "application/json"},
            "cookies": {"session": user_cookies[user]},
        }
    else:
        return {"headers": {"content-type": "application/json"}}


def load_json(file):
    return json.loads(
        open(file if file.endswith(".json") else f"{file}.json", "r").read()
    )


users = load_json("users")
projects = load_json("projects")
comments = load_json("comments")


def seed():
    for user in users:
        res = requests.post(
            f"{url}/api/user",
            data=json.dumps({"username": user, "password": "password123"}),
            **request_data(),
        )

        print(f"Create user {user} {res.status_code}")

        res = requests.post(
            f"{url}/api/login",
            data=json.dumps({"username": user, "password": "password123"}),
            **request_data(),
        )

        print(f"Login {user} {res.status_code}")

        user_cookies[user] = res.cookies.get_dict()["session"]

    for project in projects:
        res = requests.post(
            f"{url}/api/project",
            data=json.dumps(
                {
                    "key": project["key"],
                    "title": project["title"],
                    "description": project["description"],
                }
            ),
            **request_data(choice(users)),
        )

        print(f"Create project {project['key']} {res.status_code}")

        for ticket in project["tickets"]:
            res = requests.post(
                f"{url}/api/ticket",
                data=json.dumps(
                    {
                        "project": project["key"],
                        "title": ticket["title"],
                        "description": ticket["description"],
                        "priority": choice(priorities),
                        "points": randint(1, 9),
                    }
                ),
                **request_data(choice(users)),
            )

            print(f"Create ticket {res.status_code}")

            ticket_data = res.json()

            res = requests.patch(
                f"{url}/api/ticket/{ticket_data['slug']}",
                data=json.dumps({"assignee": choice(users), "status": choice(status)}),
                **request_data(choice(users)),
            )

            print(f"Update ticket {res.status_code}")

            for i in range(randint(0, 5)):
                res = requests.post(
                    f"{url}/api/ticket/{ticket_data['slug']}/comment",
                    data=json.dumps({"text": choice(comments)}),
                    **request_data(choice(users)),
                )

                print(f"Create comment {res.status_code}")


if __name__ == "__main__":
    seed()
