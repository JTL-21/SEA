import openai
import json
from random import random

openai.api_key = ""

# "A project has a name, a description and a 3 letter key derrived from the title. The description is no more than 300 words and is valid markdown, including headings and lists. Write a JSON object that is an array of up to 6 real world example projects."


def load_json(file):
    return json.loads(open(file, "r").read())


def get_completion(prompt, model="gpt-3.5-turbo"):
    messages = [{"role": "user", "content": prompt}]

    response = openai.ChatCompletion.create(
        model=model,
        messages=messages,
        temperature=0,
    )

    return response.choices[0].message["content"]


def generate_tickets():
    tickets = []

    projects = json.loads(open("projects.json", "r").read())

    for project in projects:
        print(project["key"])
        data = get_completion(
            f'Write around 15 mock jira tickets in a JSON list format for the following project. The tickets should include a title, markdown description including headings and lists, and priority of 1 to 5. The project is called "{project["title"]}" and is described as "{project["description"]}" please provide a JSON list containing the tickets: '
        )

        print(data)

        with open(f'{project["key"]}.json', "w") as f:
            f.write(data)


def generate_users():
    data = get_completion(
        f"Write around 10 test users for my website in JSON format, each user should have username field which is a common real world first name."
    )

    print(data)

    with open(f"users.json", "w") as f:
        f.write(data)


def generate_comments():
    with open(f"comments.json", "w") as f:
        f.write(
            get_completion(
                "Write 50 sample JIRA ticket comments text in a JSON array. They should sound human but be generic enough to apply to any scenario, they should include thanks messages, remarks like 'working on this now' or, 'need more info!'"
            )
        )


generate_comments()
