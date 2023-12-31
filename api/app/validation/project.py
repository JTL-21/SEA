create_project_schema = {
    "type": "object",
    "properties": {
        "key": {
            "type": "string",
            "minLength": 3,
            "maxLength": 3,
            "pattern": "^[A-Za-z]{3}$",
            "error_message": "Project key must be a 3 character A-Z string.",
        },
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
    },
    "required": ["key", "title"],
}

edit_project_schema = {
    "type": "object",
    "properties": {
        "title": create_project_schema["properties"]["title"],
        "description": create_project_schema["properties"]["description"],
    },
    "error_message": "At least one property must be provided (title, description).",
}

query_project_schema = {
    "type": "object",
    "properties": {
        "query": {
            "type": "string",
            "error_message": "Query must be of type string.",
        }
    },
    "required": ["query"],
}
