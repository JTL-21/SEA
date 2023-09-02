from flask import abort


def item_getter(required_keys, optional_keys=None):
    optional_keys = optional_keys or []

    def key_getter(input_object):
        values = []

        for required_key in required_keys:
            value = input_object.get(required_key, None)
            if not value:
                return (False, abort(400, f"{required_key} is required"))
            values.append(value)

        for optional_key in optional_keys:
            value = input_object.get(optional_key, None)
            values.append(value)

        return (True, tuple(values))

    return key_getter
