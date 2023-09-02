from flask import abort, request
from functools import wraps
from jsonschema import validate, ValidationError


def item_getter(*keys):
    def getter(data_dict):
        values = []
        for key in keys:
            value = data_dict.get(key, None)
            if isinstance(value, str):
                value = value.strip()
            values.append(value)
        return tuple(values)

    return getter


def normalize_strings(input_dict):
    for key, value in input_dict.items():
        if isinstance(value, str):
            input_dict[key] = value.strip()
        elif isinstance(value, dict):
            normalize_strings(value)
    return input_dict


def validate_body(schema):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            try:
                validate(normalize_strings(request.get_json()), schema)
            except ValidationError as e:
                return abort(
                    400,
                    e.schema["error_message"]
                    if "error_message" in e.schema
                    else e.message,
                )

            return func(*args, **kwargs)

        return wrapper

    return decorator
