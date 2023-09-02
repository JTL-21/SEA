from flask import abort, request
from functools import wraps
from jsonschema import validate, ValidationError
from app.utils.input import normalize_strings


def validate_body(schema):
    """
    Validate a flask request body with a jsonschema
    Errors are sent to the client with a 400 HTTP code
    """

    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            try:
                validate(normalize_strings(request.get_json()), schema)
            except ValidationError as error:
                # Return preset error message if exists, else return jsonschema message
                message = (
                    error.schema["error_message"]
                    if "error_message" in error.schema
                    else error.message
                )

                abort(
                    400,
                    message,
                )

            return func(*args, **kwargs)

        return wrapper

    return decorator
