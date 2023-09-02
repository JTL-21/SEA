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

login_schema = {
    "type": "object",
    "properties": {
        "username": {"type": "string", "error_message": "Username is required"},
        "password": {"type": "string", "error_message": "Password is required"},
        "stay_signed_in": {
            "type": "boolean",
            "error_message": "Stay signed in must be a boolean",
        },
    },
    "required": ["username", "password"],
}
