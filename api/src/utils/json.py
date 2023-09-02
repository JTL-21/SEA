from flask import abort


def item_getter(required_keys, optional_keys=None):
    """
    Returns a function that can be used to extract keys from a dictionary
    The returned function returns a tuple like (bool, data or error)
    If any required_keys are missing, bool is False and an abort handler is returned
    If all required_keys are set, bool is True and the values are returned in the order they were passed
    All optional keys are returned in order, set to None if they dont exist
    """

    # Set array in function to avoid mutable sharing
    optional_keys = optional_keys or []

    def key_getter(input_object):
        values = []

        for required_key in required_keys:
            value = input_object.get(required_key, None)
            if not value:
                # Return abort function to return from route
                return (False, abort(400, f"{required_key} is required"))
            values.append(value)

        for optional_key in optional_keys:
            value = input_object.get(optional_key, None)
            values.append(value)

        return (True, tuple(values))

    return key_getter
