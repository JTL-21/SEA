create_user_schema = {
    "type": "object",
    "properties": {
        "username": {
            "type": "string",
            "minLength": 1,
            "maxLength": 32,
            "error_message": "Username must be a string between 1 and 32 characters.",
        },
    },
    "required": ["username"],
}
