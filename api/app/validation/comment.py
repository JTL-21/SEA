create_comment_schema = {
    "type": "object",
    "properties": {
        "text": {
            "type": "string",
            "minLength": 1,
            "maxLength": 512,
            "error_message": "Text must be a string between 1 and 512 characters.",
        }
    },
    "required": ["text"],
}
