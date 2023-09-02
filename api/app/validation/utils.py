from flask import abort, request
from functools import wraps
from jsonschema import validate, ValidationError
from app.utils.input import normalize_strings


def validate_body(schema):
    """
    Decorator for validating a Flask request body using a JSON schema.

    This decorator is used to validate the JSON request body of a Flask route using a provided JSON schema.
    If the validation fails, an HTTP 400 error is raised, and the error message is sent to the client.

    Args:
        schema (dict): The JSON schema to be used for validation.

    Returns:
        function: A decorated version of the original function, with JSON validation.
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
