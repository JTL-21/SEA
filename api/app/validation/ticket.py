from app.validation.project import create_project_schema

create_ticket_schema = {
    "type": "object",
    "properties": {
        "title": {
            "type": "string",
            "minLength": 1,
            "maxLength": 64,
            "error_message": "Title must be a string between 1 and 64 characters.",
        },
        "description": {
            "type": "string",
            "minLength": 0,
            "maxLength": 2000,
            "error_message": "Description must be a string no longer than 2000 characters.",
        },
        "project": create_project_schema["properties"]["key"],
        "priority": {
            "type": "string",
            "enum": ["VERY_LOW", "LOW", "MEDIUM", "HIGH", "VERY_HIGH"],
            "error_message": "Priority must be VERY_LOW, LOW, MEDIUM, HIGH or VERY_HIGH.",
        },
        "points": {
            "type": "integer",
            "minimum": 0,
            "maximum": 9,
            "error_message": "Points must be a value between 0 and 9",
        },
    },
    "required": ["title", "project"],
}

edit_ticket_schema = {
    "type": "object",
    "properties": {
        "title": create_ticket_schema["properties"]["title"],
        "description": create_ticket_schema["properties"]["description"],
        "status": {
            "type": "string",
            "enum": ["WAITING", "IN_PROGRESS", "IN_TEST", "DONE"],
            "error_message": "Ticket status must be WAITING, IN_PROGRESS, IN_TEST or DONE.",
        },
        "priority": create_ticket_schema["properties"]["priority"],
        "points": create_ticket_schema["properties"]["points"],
        "assignee": {"type": "string", "error_message": "Assignee must be a string."},
    },
    "error_message": "At least one property must be provided (title, description).",
}
