from .project import create_project_schema

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
            "maxLength": 512,
            "error_message": "Description must be a string no longer than 512 characters.",
        },
        "project": create_project_schema["properties"]["key"],
    },
    "required": ["title"],
}

edit_ticket_schema = {
    "type": "object",
    "properties": {
        "title": create_ticket_schema["properties"]["title"],
        "description": create_ticket_schema["properties"]["description"],
    },
    "anyOf": [{"required": ["title"]}, {"required": ["description"]}],
    "error_message": "At least one property must be provided (title, description).",
}
