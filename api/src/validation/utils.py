from flask import abort, request
from functools import wraps
from jsonschema import validate, ValidationError


def item_getter(*keys):
    """
    Returns a function that pulls keys from a dictionary
    Missing keys are returned as None
    """

    def getter(data_dict):
        values = []
        for key in keys:
            value = data_dict.get(key, None)
            if isinstance(value, str):
                # Strip leading and trailing spaces from strings
                value = value.strip()
            values.append(value)

        return tuple(values)

    return getter


def normalize_strings(input_dict):
    """
    Recursively strip leading and trailing spaces from strings in a dict
    """

    for key, value in input_dict.items():
        if isinstance(value, str):
            input_dict[key] = value.strip()
        elif isinstance(value, dict):
            # Recurse
            normalize_strings(value)

    return input_dict


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
            except ValidationError as e:
                # Return preset error message if exists, else return jsonschema message
                message = (
                    e.schema["error_message"]
                    if "error_message" in e.schema
                    else e.message
                )

                return abort(
                    400,
                    message,
                )

            return func(*args, **kwargs)

        return wrapper

    return decorator
